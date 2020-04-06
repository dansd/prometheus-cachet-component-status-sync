import axios, { AxiosResponse } from "axios"
import { Component, ComponentResponse, ComponentPut } from "./classes/cachet/Component"

console.log("CACHET URL: " + process.env.CACHET_URL)
const url = process.env.CACHET_URL

export const CachetConnector = {
    async getComponents():
        Promise<{ [key: string]: Component }> {

        let nextPage = true
        let page = 1
        let componentList: Array<Component> = []

        while (nextPage) {
            const cres = await axios.get<ComponentResponse>(url + "components", { params: { page } })
            componentList = componentList.concat(cres.data.data)
            nextPage = !!cres.data.meta.pagination.links.next_page
            page += 1
        }

        const obj: { [key: string]: Component } = {}

        componentList.forEach(component => {
            if (component.tags && Object.keys(component.tags) && component.tags[Object.keys(component.tags)[0]]) {
                console.log(component.tags)
                obj[component.tags[Object.keys(component.tags)[0]]] = component
            }
        })
        return obj
    },

    async PutComponentStatus(cp: ComponentPut): Promise<AxiosResponse> {
        return axios.put(process.env.CACHET_URL + "components/" + cp.id, { status: cp.status }, { headers: { "X-Cachet-Token": process.env.CACHET_TOKEN } })
    }

    // async getIncidents(componentObj: { [key: string]: Component }):
    //     Promise<{ [key: number]: Array<Incident> }> {

    //     const list = await Promise.all(Object.keys(componentObj).map(async (key) => {
    //         try {
    //             // eslint-disable-next-line @typescript-eslint/camelcase
    //             const incRes = await axios.get<IncidentResponse>(process.env.CACHET_URL + "incidents", { params: { component_id: componentObj[key].id } })
    //             return { cid: componentObj[key].id, data: incRes.data.data }
    //         }
    //         catch (e) {
    //             console.error(e)
    //             return []
    //         }
    //     }))

    //     const obj: { [key: number]: Array<Incident> } = {}

    //     list.forEach(element => {
    //         const cid: number = element.cid
    //         const incident: Array<Incident> = element.data
    //         obj[cid] = []
    //         incident.forEach(i => {
    //             if (i.user_id === Number(process.env.CACHET_USER_ID)) {
    //                 obj[cid].push(i)
    //             }
    //         })
    //     })

    //     return obj
    // }
}