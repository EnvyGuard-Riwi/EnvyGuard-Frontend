
// Configuración de Salas - DATOS COMPLETOS
export const salas = {
    sala1: {
        nombre: "Sala 1",
        stats: { total: 36, online: 36, power: "3.6kW" },
        layout: [
            // LADO IZQUIERDO - Fila 1 (4 PCs)
            {
                row: 1,
                pcs: [
                    { id: "s1-row1-pc1", dbId: 1, status: "online", ip: "10.0.20.35", cpuCode: "0374" },
                    { id: "s1-row1-pc2", dbId: 2, status: "online", ip: "10.0.20.34", cpuCode: "0371" },
                    { id: "s1-row1-pc3", dbId: 3, status: "online", ip: "10.0.20.24", cpuCode: "0368" },
                    { id: "s1-row1-pc4", dbId: 4, status: "online", ip: "10.0.20.31", cpuCode: "0365" }
                ]
            },
            // LADO IZQUIERDO - Fila 2 (4 PCs)
            {
                row: 2,
                pcs: [
                    { id: "s1-row2-pc1", dbId: 5, status: "online", ip: "10.0.20.20", cpuCode: "0353" },
                    { id: "s1-row2-pc2", dbId: 6, status: "online", ip: "10.0.20.13", cpuCode: "0356" },
                    { id: "s1-row2-pc3", dbId: 7, status: "online", ip: "10.0.20.36", cpuCode: "0943" },
                    { id: "s1-row2-pc4", dbId: 8, status: "online", ip: "10.0.20.32", cpuCode: "0442" }
                ]
            },
            // LADO IZQUIERDO - Fila 3 (4 PCs)
            {
                row: 3,
                pcs: [
                    { id: "s1-row3-pc1", dbId: 9, status: "online", ip: "10.0.20.12", cpuCode: "0350" },
                    { id: "s1-row3-pc2", dbId: 10, status: "online", ip: "10.0.20.39", cpuCode: "0347" },
                    { id: "s1-row3-pc3", dbId: 11, status: "online", ip: "10.0.20.33", cpuCode: "0344" },
                    { id: "s1-row3-pc4", dbId: 12, status: "online", ip: "10.0.20.43", cpuCode: "0341" }
                ]
            },
            // LADO IZQUIERDO - Fila 4 (4 PCs)
            {
                row: 4,
                pcs: [
                    { id: "s1-row4-pc1", dbId: 13, status: "online", ip: "10.0.20.41", cpuCode: "0329" },
                    { id: "s1-row4-pc2", dbId: 14, status: "online", ip: "10.0.20.42", cpuCode: "0332" },
                    { id: "s1-row4-pc3", dbId: 15, status: "online", ip: "10.0.20.17", cpuCode: "0335" },
                    { id: "s1-row4-pc4", dbId: 16, status: "online", ip: "10.0.20.37", cpuCode: "0338" }
                ]
            },
            // LADO IZQUIERDO - Fila 5 (4 PCs)
            {
                row: 5,
                pcs: [
                    { id: "s1-row5-pc1", dbId: 17, status: "online", ip: "10.0.20.46", cpuCode: "0326" },
                    { id: "s1-row5-pc2", dbId: 18, status: "online", ip: "10.0.20.14", cpuCode: "0323" },
                    { id: "s1-row5-pc3", dbId: 19, status: "online", ip: "10.0.20.38", cpuCode: "0320" },
                    { id: "s1-row5-pc4", dbId: 20, status: "online", ip: "10.0.20.16", cpuCode: "0317" }
                ]
            },
            // LADO IZQUIERDO - Fila 6 (4 PCs)
            {
                row: 6,
                pcs: [
                    { id: "s1-row6-pc1", dbId: 21, status: "online", ip: "10.0.20.5", cpuCode: "0308" },
                    { id: "s1-row6-pc2", dbId: 22, status: "online", ip: "10.0.20.11", cpuCode: "0311" },
                    { id: "s1-row6-pc3", dbId: 23, status: "online", ip: "10.0.20.44", cpuCode: "0305" },
                    { id: "s1-row6-pc4", dbId: 24, status: "online", ip: "10.0.20.21", cpuCode: "0314" }
                ]
            },
            // LADO DERECHO - Columna 1 (6 PCs)
            {
                col: 1,
                pcs: [
                    { id: "s1-col1-pc1", dbId: 25, status: "online", ip: "10.0.20.19", cpuCode: "0377" },
                    { id: "s1-col1-pc2", dbId: 26, status: "online", ip: "10.0.20.53", cpuCode: "0380" },
                    { id: "s1-col1-pc3", dbId: 27, status: "online", ip: "10.0.20.49", cpuCode: "0363" },
                    { id: "s1-col1-pc4", dbId: 28, status: "online", ip: "10.0.20.9", cpuCode: "0386" },
                    { id: "s1-col1-pc5", dbId: 29, status: "online", ip: "10.0.20.52", cpuCode: "0389" },
                    { id: "s1-col1-pc6", dbId: 30, status: "online", ip: "10.0.20.51", cpuCode: "0392" }
                ]
            },
            // LADO DERECHO - Columna 2 (6 PCs)
            {
                col: 2,
                pcs: [
                    { id: "s1-col2-pc1", dbId: 31, status: "online", ip: "10.0.20.40", cpuCode: "0411" },
                    { id: "s1-col2-pc2", dbId: 32, status: "online", ip: "10.0.20.45", cpuCode: "0407" },
                    { id: "s1-col2-pc3", dbId: 33, status: "online", ip: "10.0.20.56", cpuCode: "0404" },
                    { id: "s1-col2-pc4", dbId: 34, status: "online", ip: "10.0.20.50", cpuCode: "0401" },
                    { id: "s1-col2-pc5", dbId: 35, status: "online", ip: "10.0.20.48", cpuCode: "0398" },
                    { id: "s1-col2-pc6", dbId: 36, status: "online", ip: "10.0.20.48", cpuCode: "0395" }
                ]
            }
        ]
    },
    salaAdicional: {
        nombre: "workshop - Piso 1",
        stats: { total: 18, online: 18, power: "1.8kW" },
        layout: [
            {
                col: 1,
                pcs: [
                    { id: "sa-col1-pc1", dbId: 1, status: "online", ip: "192.168.4.10", cpuCode: "0650" },
                    { id: "sa-col1-pc2", dbId: 2, status: "online", ip: "192.168.4.11", cpuCode: "0651" },
                    { id: "sa-col1-pc3", dbId: 3, status: "online", ip: "192.168.4.12", cpuCode: "0652" }
                ]
            },
            {
                col: 2,
                pcs: [
                    { id: "sa-col2-pc1", dbId: 4, status: "online", ip: "192.168.4.20", cpuCode: "0653" },
                    { id: "sa-col2-pc2", dbId: 5, status: "online", ip: "192.168.4.21", cpuCode: "0654" },
                    { id: "sa-col2-pc3", dbId: 6, status: "online", ip: "192.168.4.22", cpuCode: "0655" }
                ]
            },
            {
                col: 3,
                pcs: [
                    { id: "sa-col3-pc1", dbId: 7, status: "online", ip: "192.168.4.30", cpuCode: "0656" },
                    { id: "sa-col3-pc2", dbId: 8, status: "online", ip: "192.168.4.31", cpuCode: "0657" },
                    { id: "sa-col3-pc3", dbId: 9, status: "online", ip: "192.168.4.32", cpuCode: "0658" }
                ]
            },
            {
                col: 4,
                pcs: [
                    { id: "sa-col4-pc1", dbId: 10, status: "online", ip: "192.168.4.40", cpuCode: "0659" },
                    { id: "sa-col4-pc2", dbId: 11, status: "online", ip: "192.168.4.41", cpuCode: "0660" },
                    { id: "sa-col4-pc3", dbId: 12, status: "online", ip: "192.168.4.42", cpuCode: "0661" }
                ]
            },
            {
                col: 5,
                pcs: [
                    { id: "sa-col5-pc1", dbId: 13, status: "online", ip: "192.168.4.50", cpuCode: "0662" },
                    { id: "sa-col5-pc2", dbId: 14, status: "online", ip: "192.168.4.51", cpuCode: "0663" },
                    { id: "sa-col5-pc3", dbId: 15, status: "online", ip: "192.168.4.52", cpuCode: "0664" }
                ]
            },
            {
                col: 6,
                pcs: [
                    { id: "sa-col6-pc1", dbId: 16, status: "online", ip: "192.168.4.60", cpuCode: "0665" },
                    { id: "sa-col6-pc2", dbId: 17, status: "online", ip: "192.168.4.61", cpuCode: "0666" },
                    { id: "sa-col6-pc3", dbId: 18, status: "online", ip: "192.168.4.62", cpuCode: "0667" }
                ]
            }
        ]
    },
    sala2: {
        nombre: "Sala 2",
        stats: { total: 32, online: 32, power: "3.1kW" },
        layout: [
            {
                izquierda: [
                    { id: "s2-iz-pc1", dbId: 1, status: "online", ip: "192.168.2.30", cpuCode: "0552" },
                    { id: "s2-iz-pc2", dbId: 2, status: "no_internet", ip: "192.168.2.31", cpuCode: "0551" },
                    { id: "s2-iz-pc3", dbId: 3, status: "online", ip: "192.168.2.32", cpuCode: "0546" },
                    { id: "s2-iz-pc4", dbId: 4, status: "offline", ip: "192.168.2.33", cpuCode: "0543" }
                ],
                derecha: [
                    { id: "s2-der-pc1", dbId: 5, status: "online", ip: "192.168.2.40", cpuCode: "0557" },
                    { id: "s2-der-pc2", dbId: 6, status: "online", ip: "192.168.2.41", cpuCode: "0584" },
                    { id: "s2-der-pc3", dbId: 7, status: "no_internet", ip: "192.168.2.42", cpuCode: "0581" },
                    { id: "s2-der-pc4", dbId: 8, status: "online", ip: "192.168.2.43", cpuCode: "0578" }
                ]
            },
            {
                izquierda: [
                    { id: "s2-iz2-pc1", dbId: 9, status: "online", ip: "192.168.2.50", cpuCode: "0531" },
                    { id: "s2-iz2-pc2", dbId: 10, status: "online", ip: "192.168.2.51", cpuCode: "0534" },
                    { id: "s2-iz2-pc3", dbId: 11, status: "online", ip: "192.168.2.52", cpuCode: "0537" },
                    { id: "s2-iz2-pc4", dbId: 12, status: "online", ip: "192.168.2.53", cpuCode: "0564" }
                ],
                derecha: [
                    { id: "s2-der2-pc1", dbId: 13, status: "online", ip: "192.168.2.60", cpuCode: "0589" },
                    { id: "s2-der2-pc2", dbId: 14, status: "online", ip: "192.168.2.61", cpuCode: "0592" },
                    { id: "s2-der2-pc3", dbId: 15, status: "online", ip: "192.168.2.62", cpuCode: "0518" },
                    { id: "s2-der2-pc4", dbId: 16, status: "online", ip: "192.168.2.63", cpuCode: "0598" }
                ]
            },
            {
                izquierda: [
                    { id: "s2-iz3-pc1", dbId: 17, status: "online", ip: "192.168.2.70", cpuCode: "0528" },
                    { id: "s2-iz3-pc2", dbId: 18, status: "online", ip: "192.168.2.71", cpuCode: "0525" },
                    { id: "s2-iz3-pc3", dbId: 19, status: "online", ip: "192.168.2.72", cpuCode: "0522" },
                    { id: "s2-iz3-pc4", dbId: 20, status: "online", ip: "192.168.2.73", cpuCode: "0540" }
                ],
                derecha: [
                    { id: "s2-der3-pc1", dbId: 21, status: "online", ip: "192.168.2.80", cpuCode: "0610" },
                    { id: "s2-der3-pc2", dbId: 22, status: "online", ip: "192.168.2.81", cpuCode: "0616" },
                    { id: "s2-der3-pc3", dbId: 23, status: "online", ip: "192.168.2.82", cpuCode: "0604" },
                    { id: "s2-der3-pc4", dbId: 24, status: "online", ip: "192.168.2.83", cpuCode: "0601" }
                ]
            },
            {
                izquierda: [
                    { id: "s2-iz4-pc1", dbId: 25, status: "online", ip: "192.168.2.90", cpuCode: "0558" },
                    { id: "s2-iz4-pc2", dbId: 26, status: "online", ip: "192.168.2.91", cpuCode: "0561" },
                    { id: "s2-iz4-pc3", dbId: 27, status: "online", ip: "192.168.2.92", cpuCode: "0555" },
                    { id: "s2-iz4-pc4", dbId: 28, status: "online", ip: "192.168.2.93", cpuCode: "0480" }
                ],
                derecha: [
                    { id: "s2-der4-pc1", dbId: 29, status: "online", ip: "192.168.2.100", cpuCode: "0566" },
                    { id: "s2-der4-pc2", dbId: 30, status: "online", ip: "192.168.2.101", cpuCode: "0576" },
                    { id: "s2-der4-pc3", dbId: 31, status: "online", ip: "192.168.2.102", cpuCode: "0572" },
                    { id: "s2-der4-pc4", dbId: 32, status: "online", ip: "192.168.2.103", cpuCode: "0569" }
                ]
            }
        ]
    },
    salaAdicional2: {
        nombre: "workshop - Piso 2",
        stats: { total: 16, online: 16, power: "1.6kW" },
        layout: [
            {
                col: 1,
                pcs: [
                    { id: "sa2-col1-pc1", dbId: 1, status: "online", ip: "192.168.5.10", cpuCode: "0670" },
                    { id: "sa2-col1-pc2", dbId: 2, status: "online", ip: "192.168.5.11", cpuCode: "0671" },
                    { id: "sa2-col1-pc3", dbId: 3, status: "online", ip: "192.168.5.12", cpuCode: "0672" },
                    { id: "sa2-col1-pc4", dbId: 4, status: "online", ip: "192.168.5.13", cpuCode: "0673" }
                ]
            },
            {
                col: 2,
                pcs: [
                    { id: "sa2-col2-pc1", dbId: 5, status: "online", ip: "192.168.5.20", cpuCode: "0674" },
                    { id: "sa2-col2-pc2", dbId: 6, status: "online", ip: "192.168.5.21", cpuCode: "0675" },
                    { id: "sa2-col2-pc3", dbId: 7, status: "online", ip: "192.168.5.22", cpuCode: "0676" },
                    { id: "sa2-col2-pc4", dbId: 8, status: "online", ip: "192.168.5.23", cpuCode: "0677" }
                ]
            },
            {
                col: 3,
                pcs: [
                    { id: "sa2-col3-pc1", dbId: 9, status: "online", ip: "192.168.5.30", cpuCode: "0678" },
                    { id: "sa2-col3-pc2", dbId: 10, status: "online", ip: "192.168.5.31", cpuCode: "0679" },
                    { id: "sa2-col3-pc3", dbId: 11, status: "online", ip: "192.168.5.32", cpuCode: "0680" },
                    { id: "sa2-col3-pc4", dbId: 12, status: "online", ip: "192.168.5.33", cpuCode: "0681" }
                ]
            },
            {
                col: 4,
                pcs: [
                    { id: "sa2-col4-pc1", dbId: 13, status: "online", ip: "192.168.5.40", cpuCode: "0682" },
                    { id: "sa2-col4-pc2", dbId: 14, status: "online", ip: "192.168.5.41", cpuCode: "0683" },
                    { id: "sa2-col4-pc3", dbId: 15, status: "online", ip: "192.168.5.42", cpuCode: "0684" },
                    { id: "sa2-col4-pc4", dbId: 16, status: "online", ip: "192.168.5.43", cpuCode: "0685" }
                ]
            }
        ]
    },
    sala3: {
        nombre: "Sala 3",
        stats: { total: 38, online: 36, power: "3.2kW" },
        layout: [
            {
                izquierda: [
                    { id: "s3-iz-pc1", dbId: 1, status: "online", ip: "192.168.1.30", cpuCode: "0821" },
                    { id: "s3-iz-pc2", dbId: 2, status: "online", ip: "192.168.1.31", cpuCode: "0824" },
                    { id: "s3-iz-pc3", dbId: 3, status: "online", ip: "192.168.1.32", cpuCode: "0827" },
                    { id: "s3-iz-pc4", dbId: 4, status: "online", ip: "192.168.1.33", cpuCode: "0830" }
                ],
                derecha: [
                    { id: "s3-der-pc1", dbId: 5, status: "online", ip: "192.168.1.40", cpuCode: "0769" },
                    { id: "s3-der-pc2", dbId: 6, status: "online", ip: "192.168.1.41", cpuCode: "0465" },
                    { id: "s3-der-pc3", dbId: 7, status: "online", ip: "192.168.1.42", cpuCode: "0833" },
                    { id: "s3-der-pc4", dbId: 8, status: "online", ip: "192.168.1.43", cpuCode: "0715" }
                ]
            },
            {
                izquierda: [
                    { id: "s3-iz2-pc1", dbId: 9, status: "online", ip: "192.168.1.50", cpuCode: "0775" },
                    { id: "s3-iz2-pc2", dbId: 10, status: "online", ip: "192.168.1.51", cpuCode: "0778" },
                    { id: "s3-iz2-pc3", dbId: 11, status: "online", ip: "192.168.1.52", cpuCode: "0781" },
                    { id: "s3-iz2-pc4", dbId: 12, status: "online", ip: "192.168.1.53", cpuCode: "0784" }
                ],
                derecha: [
                    { id: "s3-der2-pc1", dbId: 13, status: "online", ip: "192.168.1.60", cpuCode: "0712" },
                    { id: "s3-der2-pc2", dbId: 14, status: "online", ip: "192.168.1.61", cpuCode: "0790" },
                    { id: "s3-der2-pc3", dbId: 15, status: "online", ip: "192.168.1.62", cpuCode: "0793" },
                    { id: "s3-der2-pc4", dbId: 16, status: "online", ip: "192.168.1.63", cpuCode: "0772" }
                ]
            },
            {
                izquierda: [
                    { id: "s3-iz3-pc1", dbId: 17, status: "online", ip: "192.168.1.70", cpuCode: "0806" },
                    { id: "s3-iz3-pc2", dbId: 18, status: "online", ip: "192.168.1.71", cpuCode: "0803" },
                    { id: "s3-iz3-pc3", dbId: 19, status: "online", ip: "192.168.1.72", cpuCode: "0800" },
                    { id: "s3-iz3-pc4", dbId: 20, status: "online", ip: "192.168.1.73", cpuCode: "0796" }
                ],
                derecha: [
                    { id: "s3-der3-pc1", dbId: 21, status: "online", ip: "192.168.1.80", cpuCode: "0812" },
                    { id: "s3-der3-pc2", dbId: 22, status: "online", ip: "192.168.1.81", cpuCode: "0815" },
                    { id: "s3-der3-pc3", dbId: 23, status: "online", ip: "192.168.1.82", cpuCode: "0818" },
                    { id: "s3-der3-pc4", dbId: 24, status: "online", ip: "192.168.1.83", cpuCode: "0809" }
                ]
            },
            {
                izquierda: [
                    { id: "s3-iz4-pc1", dbId: 25, status: "online", ip: "192.168.1.90", cpuCode: "0763" },
                    { id: "s3-iz4-pc2", dbId: 26, status: "online", ip: "192.168.1.91", cpuCode: "0766" },
                    { id: "s3-iz4-pc3", dbId: 27, status: "online", ip: "192.168.1.92", cpuCode: "0759" },
                    { id: "s3-iz4-pc4", dbId: 28, status: "online", ip: "192.168.1.93", cpuCode: "0787" }
                ],
                derecha: [
                    { id: "s3-der4-pc1", dbId: 29, status: "online", ip: "192.168.1.100", cpuCode: "0996" },
                    { id: "s3-der4-pc2", dbId: 30, status: "online", ip: "192.168.1.101", cpuCode: "0993" },
                    { id: "s3-der4-pc3", dbId: 31, status: "online", ip: "192.168.1.102", cpuCode: "0990" },
                    { id: "s3-der4-pc4", dbId: 32, status: "online", ip: "192.168.1.103", cpuCode: "0787" }
                ]
            },
            {
                izquierda: [
                    { id: "s3-iz5-pc1", dbId: 33, status: "online", ip: "192.168.1.110", cpuCode: "0860" },
                    { id: "s3-iz5-pc2", dbId: 34, status: "online", ip: "192.168.1.111", cpuCode: "0718" },
                    { id: "s3-iz5-pc3", dbId: 35, status: "online", ip: "192.168.1.112", cpuCode: "0766" }
                ],
                derecha: [
                    { id: "s3-der5-pc1", dbId: 36, status: "online", ip: "192.168.1.120", cpuCode: "0934" },
                    { id: "s3-der5-pc2", dbId: 37, status: "online", ip: "192.168.1.121", cpuCode: "0931" },
                    { id: "s3-der5-pc3", dbId: 38, status: "online", ip: "192.168.1.122", cpuCode: "0928" }
                ]
            }
        ]
    },
    sala4: {
        nombre: "Sala 4",
        stats: { total: 32, online: 31, power: "3.2kW" },
        layout: [
            {
                izquierda: [
                    { id: "s4-iz-pc1", dbId: 1, name: "PC 1", status: "online", ip: "10.0.120.10", cpuCode: "0697" },
                    { id: "s4-iz-pc2", dbId: 2, name: "PC 2", status: "online", ip: "10.0.120.11", cpuCode: "0700" },
                    { id: "s4-iz-pc3", dbId: 3, name: "PC 3", status: "online", ip: "10.0.120.28", cpuCode: "0703" },
                    { id: "s4-iz-pc4", dbId: 4, name: "PC 4", status: "online", ip: "10.0.120.19", cpuCode: "0706" }
                ],
                derecha: [
                    { id: "s4-der-pc1", dbId: 5, name: "PC 1", status: "online", ip: "10.0.120.27", cpuCode: "0622" },
                    { id: "s4-der-pc2", dbId: 6, name: "PC 2", status: "online", ip: "10.0.120.25", cpuCode: "0619" },
                    { id: "s4-der-pc3", dbId: 7, name: "PC 3", status: "online", ip: "10.0.120.24", cpuCode: "0616" },
                    { id: "s4-der-pc4", dbId: 8, name: "PC 4", status: "online", ip: "10.0.120.21", cpuCode: "0613" }
                ]
            },
            {
                izquierda: [
                    { id: "s4-iz2-pc1", dbId: 9, name: "PC 1", status: "online", ip: "10.0.120.13", cpuCode: "0694" },
                    { id: "s4-iz2-pc2", dbId: 10, name: "PC 2", status: "online", ip: "10.0.120.4", cpuCode: "0691" },
                    { id: "s4-iz2-pc3", dbId: 11, name: "PC 3", status: "online", ip: "10.0.120.32", cpuCode: "0688" },
                    { id: "s4-iz2-pc4", dbId: 12, name: "PC 4", status: "online", ip: "10.0.120.34", cpuCode: "0685" }
                ],
                derecha: [
                    { id: "s4-der2-pc1", dbId: 13, name: "PC 1", status: "online", ip: "10.0.120.35", cpuCode: "0625" },
                    { id: "s4-der2-pc2", dbId: 14, name: "PC 2", status: "no_internet", ip: "10.0.120.36", cpuCode: "0628" },
                    { id: "s4-der2-pc3", dbId: 15, name: "PC 3", status: "online", ip: "10.0.120.12", cpuCode: "0631" },
                    { id: "s4-der2-pc4", dbId: 16, name: "PC 4", status: "online", ip: "10.0.120.37", cpuCode: "0634" }
                ]
            },
            {
                izquierda: [
                    { id: "s4-iz3-pc1", dbId: 17, name: "PC 1", status: "online", ip: "10.0.120.5", cpuCode: "0673" },
                    { id: "s4-iz3-pc2", dbId: 18, name: "PC 2", status: "online", ip: "10.0.120.29", cpuCode: "0676" },
                    { id: "s4-iz3-pc3", dbId: 19, name: "PC 3", status: "online", ip: "10.0.120.38", cpuCode: "0679" },
                    { id: "s4-iz3-pc4", dbId: 20, name: "PC 4", status: "online", ip: "10.0.120.39", cpuCode: "0682" }
                ],
                derecha: [
                    { id: "s4-der3-pc1", dbId: 21, name: "PC 1", status: "offline", ip: "10.0.120.7", cpuCode: "0646" },
                    { id: "s4-der3-pc2", dbId: 22, name: "PC 2", status: "online", ip: "10.0.120.26", cpuCode: "0643" },
                    { id: "s4-der3-pc3", dbId: 23, name: "PC 3", status: "online", ip: "10.0.120.18", cpuCode: "0640" },
                    { id: "s4-der3-pc4", dbId: 24, name: "PC 4", status: "online", ip: "10.0.120.14", cpuCode: "0637" }
                ]
            },
            {
                izquierda: [
                    { id: "s4-iz4-pc1", dbId: 25, name: "PC 1", status: "online", ip: "10.0.120.33", cpuCode: "0670" },
                    { id: "s4-iz4-pc2", dbId: 26, name: "PC 2", status: "online", ip: "10.0.120.40", cpuCode: "0667" },
                    { id: "s4-iz4-pc3", dbId: 27, name: "PC 3", status: "online", ip: "10.0.120.17", cpuCode: "0664" },
                    { id: "s4-iz4-pc4", dbId: 28, name: "PC 4", status: "offline", ip: "10.0.120.6", cpuCode: "0661" }
                ],
                derecha: [
                    { id: "s4-der4-pc1", dbId: 29, name: "PC 1", status: "online", ip: "10.0.120.9", cpuCode: "0492" },
                    { id: "s4-der4-pc2", dbId: 30, name: "PC 2", status: "online", ip: "10.0.120.8", cpuCode: "0450" },
                    { id: "s4-der4-pc3", dbId: 31, name: "PC 3", status: "online", ip: "10.0.120.30", cpuCode: "0655" },
                    { id: "s4-der4-pc4", dbId: 32, name: "PC 4", status: "online", ip: "10.0.120.11", cpuCode: "0658" }
                ]
            }
        ]
    }
};

// Función para obtener la ubicación completa del PC basándose en los mapas de las salas
export const getLocationFromPC = (pcId, sala) => {
    // Si no se proporciona sala, intentar buscarla
    if (!sala) {
        const found = findPCAndLocation(pcId);
        if (found) {
            return {
                sector: found.sector,
                posicion: found.posicion,
                ubicacion: found.ubicacion,
                salaName: found.salaName
            };
        }
    }

    const salaData = salas[sala];
    if (!salaData) return { sector: 'Desconocido', ubicacion: 'No disponible' };

    // Buscar en el layout de la sala
    for (const section of salaData.layout) {
        // Caso 1: Estructura con "pcs" (sala1, sala2, sala3, salaAdicional, etc.)
        if (section.pcs && Array.isArray(section.pcs)) {
            for (const pc of section.pcs) {
                if (pc.id === pcId) {
                    let sectorName = '';
                    if (section.col) {
                        const colLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
                        sectorName = `Columna ${colLetters[section.col - 1] || section.col}`;
                    } else if (section.row) {
                        sectorName = `Fila ${section.row}`;
                    }

                    const posInSector = section.pcs.indexOf(pc) + 1;

                    return {
                        sector: sectorName,
                        posicion: posInSector,
                        ubicacion: `${sectorName} - Posición ${posInSector}`
                    };
                }
            }
        }

        // Caso 2: Estructura con "izquierda" y "derecha" (sala4)
        if (section.izquierda && Array.isArray(section.izquierda)) {
            for (const pc of section.izquierda) {
                if (pc.id === pcId) {
                    const posInSector = section.izquierda.indexOf(pc) + 1;
                    return {
                        sector: 'Lado Izquierdo',
                        posicion: posInSector,
                        ubicacion: `Lado Izquierdo - Posición ${posInSector}`
                    };
                }
            }
        }

        if (section.derecha && Array.isArray(section.derecha)) {
            for (const pc of section.derecha) {
                if (pc.id === pcId) {
                    const posInSector = section.derecha.indexOf(pc) + 1;
                    return {
                        sector: 'Lado Derecho',
                        posicion: posInSector,
                        ubicacion: `Lado Derecho - Posición ${posInSector}`
                    };
                }
            }
        }
    }

    return { sector: 'Desconocido', ubicacion: 'No disponible' };
};

// Mapeo de salas a números para el backend
export const getSalaNumber = (salaName) => {
    const salaMap = {
        'sala1': 1,
        'sala2': 2,
        'sala3': 3,
        'sala4': 4,
        'salaAdicional': 5,
        'salaAdicional2': 6,
    };
    return salaMap[salaName] || 1;
};

// Nueva función para encontrar un PC por su ID en CUALQUIER sala
export const findPCAndLocation = (pcId) => {
    for (const [salaKey, salaData] of Object.entries(salas)) {
        const location = getLocationFromPC(pcId, salaKey);
        if (location.sector !== 'Desconocido') {
            return {
                ...location,
                salaKey,
                salaName: salaData.nombre
            };
        }
    }
    return null;
};
