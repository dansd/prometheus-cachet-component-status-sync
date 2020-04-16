import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
import { CachetConnector } from "./cachetConnector"
import { AlertRequest } from "./classes/prometheus/Alert"
import { ComponentPut } from "./classes/cachet/Component"

const PORT = 7000

const app = express()
app.use(express.json())

if (process.env.PROMETHEUS_LABEL === undefined) {
    throw Error("environmental variable PROMETHEUS_LABEL undefinied")
}
const promLabel: string = process.env.PROMETHEUS_LABEL

app.post("/alert", async (req, res) => {
    const alertReq = req.body as AlertRequest
    const componentList = await CachetConnector.getComponents()
    // const incidentListByComponentId = await CachetConnector.getIncidents(componentList)

    const componentPuts: Array<ComponentPut> = []
    const componentPutsFiltered: Array<ComponentPut> = []

    alertReq.alerts.forEach(alert => {
        const component = componentList[alert.labels[promLabel]]

        if (component) {
            if (alert.status === "firing") {
                if (
                    alert.labels.severity
                    && alert.labels.severity === "critical"
                    && component.status < 4
                ) {
                    componentPuts.push({ id: component.id, status: 4 })
                } else if (
                    alert.labels.severity
                    && alert.labels.severity === "performanceImpact"
                    && component.status < 2) {
                    componentPuts.push({ id: component.id, status: 2 })
                }
            } else if (alert.status === "resolved") {
                if (
                    component.status > 1
                ) {
                    componentPuts.push({ id: component.id, status: 1 })
                }
            }
        }
    })

    componentPuts.forEach(cPut => {
        const newPut = componentPutsFiltered.find(item => item.id === cPut.id)
        if (newPut) {
            if (newPut.status < cPut.status) {
                newPut.status = cPut.status
            }
            return
        }
        componentPutsFiltered.push(cPut)
    })

    componentPutsFiltered.forEach(c => {
        CachetConnector.PutComponentStatus(c).then(r => console.log(r)).catch(console.log)
    })
    console.log(componentPutsFiltered)
    res.send("hello!")
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
