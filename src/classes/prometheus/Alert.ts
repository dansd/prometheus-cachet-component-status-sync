/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
export interface AlertRequest {
        version: string;
        groupKey: string;
        status: "resolved" | "firing";
        receiver: string;
        groupLabels: object;
        commonLabels: object;
        commonAnnotations: object;
        externalURL: string;
        alerts: Array<Alert>;
}

export interface Alert {
        status: "resolved" | "firing";
        labels: {
                "severity": "performanceImpact" | "warning" | "critical";
                "service": string;
                [x: string]: string;
        };
        annotations: object;
        startsAt: Date;
        endsAt: Date;
        generatorURL: string;
}