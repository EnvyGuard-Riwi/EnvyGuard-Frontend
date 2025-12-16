import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
Monitor,
ChevronDown,
Wifi,
WifiOff,
Server,
X,
CheckCircle2,
Power,
RotateCw,
HardDrive,
Package,
FileText,
Zap,
Terminal,
AlertCircle,
Lock,
Activity
} from 'lucide-react';
import { deviceService, WebSocketService, incidentService, INCIDENT_SEVERITY, commandService, COMMAND_ACTIONS } from '../../../services';
import Toast from '../components/Toast';
import ScrollArea from '../components/ScrollArea';
import ReportProblemModal from '../components/ReportProblemModal';

const ComputerMonitoringSection = ({ showDeployModal, setShowDeployModal, deployTargetPCs, setDeployTargetPCs, problemReports, setProblemReports }) => {
const [selectedPC, setSelectedPC] = useState(null);
const [actionLoading, setActionLoading] = useState(null);
const [selectedSala, setSelectedSala] = useState("sala1");
const [dropdownOpen, setDropdownOpen] = useState(false);
const [filter, setFilter] = useState("all");
const [selectedList, setSelectedList] = useState(new Set());
const [showBulkModal, setShowBulkModal] = useState(false);
const [toast, setToast] = useState(null);
const [loadingDevices, setLoadingDevices] = useState(false);
const [deviceStatusOverrides, setDeviceStatusOverrides] = useState({}); // ip -> {status, meta}
const [showReportModal, setShowReportModal] = useState(false);
const [selectedPCForReport, setSelectedPCForReport] = useState(null);
const [isCheckingStatus, setIsCheckingStatus] = useState(false);
const [lastStatusCheck, setLastStatusCheck] = useState(null);

// Configuración de Salas - DATOS COMPLETOS
const salas = {
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
            { id: "s4-iz-pc1", dbId: 1, name: "PC 1", status: "online", ip: "10.0.120.2", cpuCode: "0697" },
            { id: "s4-iz-pc2", dbId: 2, name: "PC 2", status: "online", ip: "10.0.120.6", cpuCode: "0700" },
            { id: "s4-iz-pc3", dbId: 3, name: "PC 3", status: "online", ip: "10.0.120.25", cpuCode: "0703" },
            { id: "s4-iz-pc4", dbId: 4, name: "PC 4", status: "online", ip: "10.0.120.7", cpuCode: "0706" }
        ],
        derecha: [
            { id: "s4-der-pc1", dbId: 5, name: "PC 1", status: "online", ip: "10.0.120.27", cpuCode: "0622" },
            { id: "s4-der-pc2", dbId: 6, name: "PC 2", status: "online", ip: "10.0.120.25", cpuCode: "0619" },
            { id: "s4-der-pc3", dbId: 7, name: "PC 3", status: "online", ip: "10.0.120.24", cpuCode: "0616" },
            { id: "s4-der-pc4", dbId: 8, name: "PC 4", status: "online", ip: "10.0.120.4", cpuCode: "0613" }
        ]
        },
        { 
        izquierda: [
            { id: "s4-iz2-pc1", dbId: 9, name: "PC 1", status: "online", ip: "10.0.120.21", cpuCode: "0694" },
            { id: "s4-iz2-pc2", dbId: 10, name: "PC 2", status: "online", ip: "10.0.120.22", cpuCode: "0691" },
            { id: "s4-iz2-pc3", dbId: 11, name: "PC 3", status: "online", ip: "10.0.120.14", cpuCode: "0688" },
            { id: "s4-iz2-pc4", dbId: 12, name: "PC 4", status: "online", ip: "10.0.120.5", cpuCode: "0685" }
        ],
        derecha: [
            { id: "s4-der2-pc1", dbId: 13, name: "PC 1", status: "online", ip: "10.0.120.23", cpuCode: "0625" },
            { id: "s4-der2-pc2", dbId: 14, name: "PC 2", status: "no_internet", ip: "10.0.120.12", cpuCode: "0628" },
            { id: "s4-der2-pc3", dbId: 15, name: "PC 3", status: "online", ip: "10.0.120.19", cpuCode: "0631" },
            { id: "s4-der2-pc4", dbId: 16, name: "PC 4", status: "online", ip: "10.0.120.32", cpuCode: "0634" }
        ]
        },
        { 
        izquierda: [
            { id: "s4-iz3-pc1", dbId: 17, name: "PC 1", status: "online", ip: "10.0.120.29", cpuCode: "0673" },
            { id: "s4-iz3-pc2", dbId: 18, name: "PC 2", status: "online", ip: "10.0.120.15", cpuCode: "0676" },
            { id: "s4-iz3-pc3", dbId: 19, name: "PC 3", status: "online", ip: "10.0.120.16", cpuCode: "0679" },
            { id: "s4-iz3-pc4", dbId: 20, name: "PC 4", status: "online", ip: "10.0.120.10", cpuCode: "0682" }
        ],
        derecha: [
            { id: "s4-der3-pc1", dbId: 21, name: "PC 1", status: "offline", ip: "10.0.120.", cpuCode: "0646" },
            { id: "s4-der3-pc2", dbId: 22, name: "PC 2", status: "online", ip: "10.0.120.18", cpuCode: "0643" },
            { id: "s4-der3-pc3", dbId: 23, name: "PC 3", status: "online", ip: "10.0.120.3", cpuCode: "0640" },
            { id: "s4-der3-pc4", dbId: 24, name: "PC 4", status: "online", ip: "10.0.120.33", cpuCode: "0637" }
        ]
        },
        { 
        izquierda: [
            { id: "s4-iz4-pc1", dbId: 25, name: "PC 1", status: "online", ip: "10.0.120.31", cpuCode: "0670" },
            { id: "s4-iz4-pc2", dbId: 26, name: "PC 2", status: "online", ip: "10.0.120.17", cpuCode: "0667" },
            { id: "s4-iz4-pc3", dbId: 27, name: "PC 3", status: "online", ip: "10.0.120.20", cpuCode: "0664" },
            { id: "s4-iz4-pc4", dbId: 28, name: "PC 4", status: "offline", ip: "10.0.120.9", cpuCode: "0661" }
        ],
        derecha: [
            { id: "s4-der4-pc1", dbId: 29, name: "PC 1", status: "online", ip: "10.0.120.", cpuCode: "0492" },
            { id: "s4-der4-pc2", dbId: 30, name: "PC 2", status: "online", ip: "10.0.120.30", cpuCode: "0450" },
            { id: "s4-der4-pc3", dbId: 31, name: "PC 3", status: "online", ip: "10.0.120.11", cpuCode: "0655" },
            { id: "s4-der4-pc4", dbId: 32, name: "PC 4", status: "online", ip: "10.0.120.8", cpuCode: "0658" }
        ]
        }
    ] 
    }
};

const handleReportSubmit = async (reportData) => {
    const location = getLocationFromPC(reportData.device, reportData.sala);
    
    // Mapear severidad del frontend (low/medium/high) al backend (LOW/MEDIUM/HIGH)
    const severityMap = {
    'low': INCIDENT_SEVERITY.LOW,
    'medium': INCIDENT_SEVERITY.MEDIUM,
    'high': INCIDENT_SEVERITY.HIGH,
    };

    try {
    // Crear el incidente en el backend
    const createdIncident = await incidentService.createIncident({
        description: `[${reportData.sala}] [${reportData.cpuCode}] [IP: ${reportData.ip}] [PC: ${reportData.pcId || reportData.device}] - ${reportData.description}`,
        severity: severityMap[reportData.severity] || INCIDENT_SEVERITY.LOW,
    });

    console.log('✅ Incidente creado en el backend:', createdIncident);

    // También guardar localmente para mostrar en la UI
    const newReport = {
        id: createdIncident.id || Math.random().toString(36).substr(2, 9),
        ...reportData,
        displayTimestamp: new Date(reportData.timestamp).toLocaleString('es-ES'),
        status: 'open',
        type: 'Reporte',
        sector: location.sector,
        ubicacion: location.ubicacion,
        posicion: location.posicion,
        pcId: reportData.pcId || reportData.device
    };
    setProblemReports(prev => [newReport, ...prev]);
    setShowReportModal(false);
    setSelectedPCForReport(null);
    setToast({ type: 'success', msg: `Problema reportado exitosamente en ${reportData.device}` });
    } catch (error) {
    console.error('❌ Error al crear incidente:', error);
    setToast({ type: 'error', msg: `Error al reportar problema: ${error.message}` });
    }
};

// Mapeo de salas a números para el backend
const getSalaNumber = (salaName) => {
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

// Obtener todos los PCs de una sala
const getAllPCsFromSala = (salaKey) => {
    const salaData = salas[salaKey];
    if (!salaData) return [];
    
    const allPCs = [];
    const isSingleColumn = salaKey === 'sala1' || salaKey === 'salaAdicional' || salaKey === 'salaAdicional2';
    
    if (isSingleColumn) {
    salaData.layout.forEach(section => {
        if (section.pcs) {
        section.pcs.forEach(pc => allPCs.push(pc));
        }
    });
    } else {
    salaData.layout.forEach(fila => {
        if (fila.izquierda) {
        fila.izquierda.forEach(pc => allPCs.push(pc));
        }
        if (fila.derecha) {
        fila.derecha.forEach(pc => allPCs.push(pc));
        }
    });
    }
    
    return allPCs;
};

// Verificar estado de todos los PCs usando el endpoint /computers
const checkAllPCsStatus = async () => {
    setIsCheckingStatus(true);
    console.log('[Status Check] Obteniendo estado de computadores...');
    
    try {
    // Usar el nuevo endpoint GET /computers para estado en tiempo real
    const computers = await deviceService.getComputersStatus();
    
    // Mapear por IP para actualizar el estado visual
    const newOverrides = { ...deviceStatusOverrides };
    let online = 0, offline = 0;
    
    computers?.forEach(computer => {
        if (computer?.ipAddress) {
        const isOnline = computer.status?.toUpperCase() === 'ONLINE';
        newOverrides[computer.ipAddress] = { 
            status: isOnline ? 'online' : 'offline',
            name: computer.name,
            macAddress: computer.macAddress,
            lastSeen: computer.lastSeen,
            roomNumber: computer.roomNumber,
            positionInRoom: computer.positionInRoom,
            lastCheck: new Date()
        };
        if (isOnline) online++; else offline++;
        }
    });
    
    setDeviceStatusOverrides(newOverrides);
    setLastStatusCheck(new Date());
    
    console.log(`[Status Check] Completado: ${online} online, ${offline} offline de ${computers?.length || 0} totales`);
    
    // Mostrar toast con resultado
    setToast({ 
        type: online > 0 ? 'success' : 'warn', 
        msg: `Estado actualizado: ${online} online, ${offline} offline` 
    });
    setTimeout(() => setToast(null), 3000);
    
    } catch (error) {
    console.error('[Status Check] Error:', error);
    setToast({ type: 'error', msg: 'Error al obtener estado de computadores' });
    setTimeout(() => setToast(null), 3000);
    } finally {
    setIsCheckingStatus(false);
    }
};

// Verificar estado al cargar y cuando cambia la sala
useEffect(() => {
    // Verificar estado inicial
    checkAllPCsStatus();
    
    // Configurar verificación periódica cada 30 segundos
    const intervalId = setInterval(() => {
    checkAllPCsStatus();
    }, 30000);
    
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedSala]);

const handleAction = async (action, pcId, ip, dbId) => {
    // Si la acción es reportar problema, abre el modal
    if (action === 'report') {
    setSelectedPCForReport({ id: pcId, ip });
    setShowReportModal(true);
    setSelectedPC(null);
    return;
    }

    // Si la acción es instalar apps, abre el modal de despliegue
    if (action === 'install') {
    // Extraer número de sala del ID
    const salaMatch = pcId.match(/s(\d+)/i);
    const salaNumber = salaMatch ? parseInt(salaMatch[1]) : getSalaNumber(selectedSala);
    
    console.log('[handleAction install] Creating deploy target:', { id: pcId, ip, dbId, salaNumber });
    
    setDeployTargetPCs([{ id: pcId, ip, dbId, salaNumber }]);
    setShowDeployModal(true);
    setSelectedPC(null);
    return;
    }

    setActionLoading(`${pcId}-${action}`);
    
    // Extraer número de sala del ID
    const salaMatch = pcId.match(/s(\d+)/i);
    const salaNumber = salaMatch ? parseInt(salaMatch[1]) : getSalaNumber(selectedSala);
    
    // Usar dbId si está disponible, sino extraer del ID del PC
    let numericPcId;
    if (dbId) {
    numericPcId = dbId;
    } else {
    const pcMatch = pcId.match(/pc(\d+)/i);
    numericPcId = pcMatch ? parseInt(pcMatch[1]) : 1;
    }
    
    try {
    // Mapear acciones del frontend a acciones del backend
    const actionMap = {
        'power': COMMAND_ACTIONS.SHUTDOWN,
        'shutdown': COMMAND_ACTIONS.SHUTDOWN,
        'restart': COMMAND_ACTIONS.REBOOT,
        'reboot': COMMAND_ACTIONS.REBOOT,
        'wake': COMMAND_ACTIONS.WAKE_ON_LAN,
        'wol': COMMAND_ACTIONS.WAKE_ON_LAN,
        'start': COMMAND_ACTIONS.WAKE_ON_LAN,  // Encender PC
        'lock': COMMAND_ACTIONS.LOCK_SESSION,
        'format': 'FORMAT',
        'clean': 'FORMAT',
        'cleanup': 'FORMAT',
    };
    
    const backendAction = actionMap[action.toLowerCase()];
    
    if (!backendAction) {
        console.error(`[handleAction] Acción no reconocida: ${action}`);
        setToast({ type: "error", msg: `Acción no soportada: ${action}` });
        return;
    }
    
    console.log(`[handleAction] Enviando: salaNumber=${salaNumber}, pcId=${numericPcId}, action=${backendAction}, dbId=${dbId || 'no disponible'}`);
    
    // Usar endpoints específicos con query params según la acción
    if (backendAction === COMMAND_ACTIONS.WAKE_ON_LAN) {
    await commandService.sendWakeOnLan(salaNumber, numericPcId);
    } else if (backendAction === COMMAND_ACTIONS.SHUTDOWN) {
    await commandService.sendShutdown(salaNumber, numericPcId);
    } else if (backendAction === COMMAND_ACTIONS.REBOOT) {
    await commandService.sendReboot(salaNumber, numericPcId);
    } else if (backendAction === COMMAND_ACTIONS.LOCK_SESSION) {
    await commandService.sendLockSession(salaNumber, numericPcId);
    } else if (backendAction === 'FORMAT') {
    await commandService.sendFormat(salaNumber, numericPcId);
    } else {
    // Enviar comando con body JSON para otras acciones
    await commandService.sendCommand({
        salaNumber,
        pcId: numericPcId,
        action: backendAction,
    });
    }
    
    setToast({ type: "success", msg: `Comando ${action} enviado a PC ${numericPcId}` });
    } catch (e) {
    console.error('Error al enviar comando:', e);
    setToast({ type: "error", msg: e.message || `Error enviando ${action} a ${pcId}` });
    } finally {
    setTimeout(() => setActionLoading(null), 600);
    setTimeout(() => setToast(null), 2500);
    }
};

const handleBulkAction = async (action) => {
    if (selectedList.size === 0) return;
    
    // Función auxiliar para obtener los datos completos del PC desde el layout
    const findPCData = (pcItem) => {
      const pcId = typeof pcItem === 'string' ? pcItem : pcItem.id;
      const currentSalaData = salas[selectedSala];
      if (!currentSalaData) return null;
      
      for (const section of currentSalaData.layout) {
        // Para salas con estructura de filas (row)
        if (section.row && section.pcs) {
          const found = section.pcs.find(pc => pc.id === pcId);
          if (found) return found;
        }
        // Para salas con estructura de columnas (col)
        if (section.col && section.pcs) {
          const found = section.pcs.find(pc => pc.id === pcId);
          if (found) return found;
        }
        // Para salas con estructura izquierda/derecha
        if (section.izquierda) {
          const found = section.izquierda.find(pc => pc.id === pcId);
          if (found) return found;
        }
        if (section.derecha) {
          const found = section.derecha.find(pc => pc.id === pcId);
          if (found) return found;
        }
      }
      return null;
    };
    
    // Si la acción es instalar apps, abre el modal de despliegue con objetos completos
    if (action === 'install') {
      const items = Array.from(selectedList);
      const fullPCData = items.map(item => {
        // Si item ya es un objeto con datos completos
        if (typeof item === 'object' && item.dbId) {
          return item;
        }
        
        // Buscar datos completos del PC
        const pcId = typeof item === 'string' ? item : item.id;
        const pcData = findPCData(pcId);
        
        // Extraer número de sala
        const salaMatch = pcId.match(/s(\d+)/i);
        const salaNumber = salaMatch ? parseInt(salaMatch[1]) : getSalaNumber(selectedSala);
        
        if (pcData && pcData.dbId) {
          return {
            id: pcId,
            ip: pcData.ip || (typeof item === 'object' ? item.ip : ''),
            dbId: pcData.dbId,
            salaNumber
          };
        }
        
        // Fallback: construir con lo que tengamos
        return {
          id: pcId,
          ip: typeof item === 'object' ? item.ip : '',
          dbId: typeof item === 'object' ? item.dbId : null,
          salaNumber
        };
      }).filter(pc => pc.dbId); // Filtrar los que no tienen dbId
      
      console.log('[handleBulkAction install] PCs completos:', fullPCData);
      
      if (fullPCData.length === 0) {
        setToast({ type: "error", msg: "No se encontraron datos de los PCs seleccionados" });
        return;
      }
      
      setDeployTargetPCs(fullPCData);
      setShowDeployModal(true);
      setShowBulkModal(false);
      return;
    }

    const items = Array.from(selectedList);
    setActionLoading(`bulk-${action}`);
    
    // Mapear acciones del frontend a acciones del backend
    const actionMap = {
    'power': COMMAND_ACTIONS.SHUTDOWN,
    'shutdown': COMMAND_ACTIONS.SHUTDOWN,
    'restart': COMMAND_ACTIONS.REBOOT,
    'reboot': COMMAND_ACTIONS.REBOOT,
    'wake': COMMAND_ACTIONS.WAKE_ON_LAN,
    'wol': COMMAND_ACTIONS.WAKE_ON_LAN,
    'start': COMMAND_ACTIONS.WAKE_ON_LAN,
    'lock': COMMAND_ACTIONS.LOCK_SESSION,
    'format': 'FORMAT',
    'clean': 'FORMAT',
    'cleanup': 'FORMAT',
    };
    const backendAction = actionMap[action.toLowerCase()];
    
    if (!backendAction) {
    console.error(`[handleBulkAction] Acción no reconocida: ${action}`);
    setToast({ type: "error", msg: `Acción no soportada: ${action}` });
    setActionLoading(null);
    return;
    }
    
    try {
    // Enviar comando a cada PC seleccionado usando los endpoints específicos
    const results = await Promise.allSettled(
        items.map(async ({ id, ip, dbId }) => {
        // Buscar los datos completos del PC si no tenemos dbId
        const pcData = !dbId ? findPCData(id) : null;
        
        // Extraer número de sala del ID (s1 = sala 1, s2 = sala 2, etc.) o usar sala actual
        const salaMatch = id.match(/s(\d+)/i);
        const salaNumber = salaMatch ? parseInt(salaMatch[1]) : getSalaNumber(selectedSala);
        
        // Usar dbId directo, del PC data, o extraer del ID
        let numericPcId;
        if (dbId) {
            numericPcId = dbId;
        } else if (pcData && pcData.dbId) {
            numericPcId = pcData.dbId;
        } else {
            const pcMatch = id.match(/pc(\d+)/i);
            numericPcId = pcMatch ? parseInt(pcMatch[1]) : 1;
        }
        
        console.log(`[handleBulkAction] Enviando ${backendAction} a: salaNumber=${salaNumber}, pcId=${numericPcId}, id=${id}, dbId=${dbId}`);
        
        // Usar el endpoint específico según la acción
        if (backendAction === COMMAND_ACTIONS.WAKE_ON_LAN) {
            return commandService.sendWakeOnLan(salaNumber, numericPcId);
        } else if (backendAction === COMMAND_ACTIONS.SHUTDOWN) {
            return commandService.sendShutdown(salaNumber, numericPcId);
        } else if (backendAction === COMMAND_ACTIONS.REBOOT) {
            return commandService.sendReboot(salaNumber, numericPcId);
        } else if (backendAction === COMMAND_ACTIONS.LOCK_SESSION) {
            return commandService.sendLockSession(salaNumber, numericPcId);
        } else if (backendAction === 'FORMAT') {
            return commandService.sendFormat(salaNumber, numericPcId);
        } else {
            // Fallback a sendCommand para otras acciones
            return commandService.sendCommand({
            salaNumber,
            pcId: numericPcId,
            action: backendAction,
            });
        }
        })
    );
    
    const ok = results.filter(r => r.status === 'fulfilled').length;
    const fail = results.length - ok;
    
    // Log de errores para debugging
    results.forEach((r, i) => {
        if (r.status === 'rejected') {
        console.error(`[handleBulkAction] Error en PC ${items[i].id}:`, r.reason);
        }
    });
    
    setToast({ type: fail ? "warn" : "success", msg: `Acción ${action}: ${ok} ok, ${fail} error(es)` });
    } catch (e) {
    console.error('[handleBulkAction] Error general:', e);
    setToast({ type: "error", msg: `Error ejecutando acción masiva ${action}` });
    } finally {
    setTimeout(() => setActionLoading(null), 600);
    setTimeout(() => setToast(null), 3000);
    }
};

const PCCard = ({ pc }) => {
    // Resuelve estado efectivo con overrides (WebSocket/API) por IP si existe
    const override = deviceStatusOverrides[pc.ip];
    const effectiveStatus = override?.status || pc.status;
    
    // Filtrar según el estado seleccionado
    if (filter === "online" && effectiveStatus !== "online") return null;
    if (filter === "offline" && effectiveStatus === "online") return null;

    // Determinar color del indicador según estado
    const getStatusColor = () => {
    if (effectiveStatus === "online") return { bg: "bg-green-500", border: "border-green-500/20", hover: "hover:border-green-500/50 hover:bg-green-500/10 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]", dotColor: "bg-green-500" };
    if (effectiveStatus === "no_internet") return { bg: "bg-yellow-500", border: "border-yellow-500/20", hover: "hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]", dotColor: "bg-yellow-500" };
    return { bg: "bg-red-500", border: "border-red-500/20", hover: "hover:border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]", dotColor: "bg-red-500" };
    };

    const statusStyle = getStatusColor();
    const isOnline = effectiveStatus === "online";
    const isSelected = Array.from(selectedList).some(s => s.id === pc.id);
    return (
    <motion.div
        layout
        whileHover={{ scale: 1.05, y: -2 }}
        onClick={(e) => {
        if (e.shiftKey || e.ctrlKey || e.metaKey) {
            // selección múltiple
            const salaNum = getSalaNumber(selectedSala);
            setSelectedList(prev => {
            const next = new Set(prev);
            const exists = Array.from(next).some(s => s.id === pc.id);
            if (exists) {
                next.forEach(s => { if (s.id === pc.id) next.delete(s); });
            } else {
                next.add({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum });
            }
            return next;
            });
        } else {
            setSelectedPC({ ...pc, status: effectiveStatus });
        }
        }}
        className={`group relative p-3 rounded-lg border cursor-pointer transition-all flex-shrink-0 backdrop-blur-sm min-w-[120px] ${statusStyle.border} ${statusStyle.hover} ${statusStyle.bg}/5 ${isSelected ? "ring-2 ring-cyan-400/60" : ""}`}
    >
        {/* Checkbox en esquina superior derecha */}
        <div className="absolute top-2 right-2 z-20">
        <button
            onClick={(e) => {
            e.stopPropagation();
            const salaNum = getSalaNumber(selectedSala);
            setSelectedList(prev => {
                const next = new Set(prev);
                const exists = Array.from(next).some(s => s.id === pc.id);
                if (exists) {
                next.forEach(s => { if (s.id === pc.id) next.delete(s); });
                } else {
                next.add({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum });
                }
                return next;
            });
            }}
            className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
            isSelected 
                ? 'bg-cyan-500/80 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                : 'border-gray-400/40 hover:border-cyan-400/60'
            }`}
        >
            {isSelected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
        </button>
        </div>

        <div className="flex items-center gap-2 mb-2">
        <div className="relative">
            <div className={`w-2 h-2 rounded-full ${statusStyle.dotColor} z-10 relative`} />
            <div className={`absolute inset-0 w-2 h-2 rounded-full ${statusStyle.dotColor} ${effectiveStatus !== "offline" ? "animate-ping" : ""}`} />
        </div>
        <span className="text-xs font-mono text-gray-200 font-bold tracking-tight">{pc.id.split('-').pop().toUpperCase()}</span>
        </div>
        {pc.cpuCode && (
        <div className="text-[10px] font-mono text-gray-400">{pc.cpuCode}</div>
        )}
        <div className="text-[10px] text-gray-500 font-mono group-hover:text-cyan-400 transition-colors">{pc.ip}</div>
        {override?.latencyMs !== undefined && (
        <div className="mt-1 text-[10px] font-mono text-gray-600">{override.latencyMs} ms</div>
        )}
    </motion.div>
    );
};

// Función para obtener la ubicación completa del PC basándose en los mapas de las salas
const getLocationFromPC = (pcId, sala) => {
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

const currentRoom = salas[selectedSala] || salas.sala1;

// Cargar estado de computadores desde API y poblar overrides por IP
useEffect(() => {
    let cancelled = false;
    const fetchComputersStatus = async () => {
    setLoadingDevices(true);
    try {
        // Usar el nuevo endpoint GET /computers para estado en tiempo real
        const computers = await deviceService.getComputersStatus();
        if (cancelled) return;
        
        // Mapear por IP para actualizar el estado visual
        const map = {};
        computers?.forEach(computer => {
        if (computer?.ipAddress) {
            map[computer.ipAddress] = { 
            status: computer.status?.toLowerCase() || 'offline',
            name: computer.name,
            macAddress: computer.macAddress,
            lastSeen: computer.lastSeen,
            roomNumber: computer.roomNumber,
            positionInRoom: computer.positionInRoom
            };
        }
        });
        setDeviceStatusOverrides(prev => ({ ...prev, ...map }));
        setLastStatusCheck(new Date());
    } catch (e) {
        console.error('[ComputerMonitoringSection] Error al obtener estado:', e);
        // Silencioso: permanecer con datos locales
    } finally {
        if (!cancelled) setLoadingDevices(false);
    }
    };
    fetchComputersStatus();
    // Refrescar cada 30 segundos
    const id = setInterval(fetchComputersStatus, 30000);
    return () => { cancelled = true; clearInterval(id); };
}, []);

// Conexión WebSocket para estado en vivo (sin indicador visual)
useEffect(() => {
    let mounted = true;
    const onMessage = (data) => {
    if (!mounted || !data) return;
    if (data.type === 'device_status' && (data.ip || data.id)) {
        setDeviceStatusOverrides(prev => ({
        ...prev,
        ...(data.ip ? { [data.ip]: { status: data.status, latencyMs: data.latencyMs } } : {})
        }));
    }
    };
    const connect = async () => {
    try {
        await WebSocketService.connect();
    } catch (e) {
        // noop
    }
    };
    WebSocketService.on('message', onMessage);
    connect();
    return () => {
    mounted = false;
    WebSocketService.off('message', onMessage);
    WebSocketService.disconnect();
    };
}, []);

return (
    <div className="space-y-6 h-full flex flex-col">
    {/* Toast Reutilizable */}
    <Toast toast={toast} onClose={() => setToast(null)} />
    
    {/* Header & Controls - ELEVATED Z-INDEX */}
    <div className="relative z-30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
        <div className="relative z-50">
        <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-cyan-900/50 to-transparent border border-cyan-500/30 rounded-lg text-cyan-100 hover:border-cyan-400 transition-all min-w-[200px]"
        >
            <Monitor size={18} className="text-cyan-400" />
            <span className="font-mono text-sm font-bold">{currentRoom.nombre}</span>
            <ChevronDown size={16} className={`ml-auto transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
            {dropdownOpen && (
            <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 w-full bg-black border border-cyan-500/50 rounded-lg shadow-2xl shadow-cyan-900/40 z-50 overflow-hidden"
                >
                {Object.entries(salas).map(([key, sala]) => (
                    <button
                    key={key}
                    onClick={() => { setSelectedSala(key); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-3 text-sm font-mono text-gray-300 hover:bg-cyan-900/20 hover:text-cyan-400 transition-colors flex justify-between items-center border-b border-white/5 last:border-0"
                    >
                    {sala.nombre}
                    {selectedSala === key && <CheckCircle2 size={16} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
                    </button>
                ))}
                </motion.div>
            </>
            )}
        </AnimatePresence>
        </div>

        {/* Quick Stats Bar */}
        <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400 items-center">
        <div className="flex items-center gap-2">
            <Monitor size={14} className="text-cyan-500" />
            <span>Total: <b className="text-white">{currentRoom.stats.total}</b></span>
        </div>
        <div className="flex items-center gap-2">
            <Wifi size={14} className="text-green-500" />
            <span>Online: <b className="text-green-400">{Object.values(deviceStatusOverrides).filter(s => s.status === 'online').length || '...'}</b></span>
        </div>
        <div className="flex items-center gap-2">
            <WifiOff size={14} className="text-red-500" />
            <span>Offline: <b className="text-red-400">{Object.values(deviceStatusOverrides).filter(s => s.status === 'offline').length || '...'}</b></span>
        </div>
        
        {/* Indicador de verificación de estado */}
        <div className="flex items-center gap-2 ml-auto">
            {isCheckingStatus ? (
            <div className="flex items-center gap-2 text-cyan-400">
                <Activity size={14} className="animate-pulse" />
                <span className="text-[10px]">Verificando...</span>
            </div>
            ) : (
            <button
                onClick={() => checkAllPCsStatus()}
                className="flex items-center gap-1.5 text-gray-500 hover:text-cyan-400 transition-colors"
                title="Actualizar estado de PCs"
            >
                <RotateCw size={12} />
                <span className="text-[10px]">
                {lastStatusCheck ? `Actualizado ${lastStatusCheck.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}` : 'Actualizar'}
                </span>
            </button>
            )}
        </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 bg-black/50 p-1 rounded-lg border border-white/10">
        {[
            { id: "all", label: "Todos", icon: Server },
            { id: "online", label: "Online", icon: Wifi },
            { id: "offline", label: "Offline", icon: WifiOff },
        ].map(f => (
            <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === f.id ? "bg-cyan-500/20 text-cyan-400 shadow-sm" : "text-gray-500 hover:text-gray-300"
            }`}
            >
            <f.icon size={12} /> {f.label}
            </button>
        ))}
        </div>
    </div>

    {/* Indicador de carga dispositivos */}
    <AnimatePresence>
        {loadingDevices && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <RotateCw size={14} className="animate-spin text-cyan-400" />
            Cargando dispositivos...
        </motion.div>
        )}
    </AnimatePresence>

    {/* Barra de control rápido - siempre visible */}
    <div className="z-20 bg-black/40 border border-cyan-500/10 rounded-lg p-3 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
        {/* Botón Seleccionar/Deseleccionar Todo */}
        <button 
            onClick={() => {
            const allPCs = [];
            const isSingleColumn = selectedSala === 'sala1' || selectedSala === 'salaAdicional' || selectedSala === 'salaAdicional2';
            const salaNum = getSalaNumber(selectedSala);
            if (isSingleColumn) {
                currentRoom.layout.forEach(col => {
                if (col.pcs) col.pcs.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum }));
                });
            } else {
                currentRoom.layout.forEach(fila => {
                if (fila.izquierda) fila.izquierda.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum }));
                if (fila.derecha) fila.derecha.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum }));
                });
            }
            // Toggle: si todos están seleccionados, deselecciona; si no, selecciona todos
            const allSelected = allPCs.length > 0 && selectedList.size === allPCs.length;
            setSelectedList(allSelected ? new Set() : new Set(allPCs));
            }}
            className={`group px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-300 flex items-center gap-2.5 ${
            selectedList.size > 0 && (selectedSala === 'sala1' || selectedSala === 'salaAdicional' || selectedSala === 'salaAdicional2'
                ? currentRoom.layout.every(col => !col.pcs || col.pcs.every(pc => Array.from(selectedList).some(s => s.id === pc.id)))
                : currentRoom.layout.every(fila => 
                    (!fila.izquierda || fila.izquierda.every(pc => Array.from(selectedList).some(s => s.id === pc.id))) &&
                    (!fila.derecha || fila.derecha.every(pc => Array.from(selectedList).some(s => s.id === pc.id)))
                ))
                ? 'border-red-500/40 hover:border-red-400 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                : 'border-blue-500/40 hover:border-blue-400 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]'
            }`}
        >
            {selectedList.size > 0 && (selectedSala === 'sala1' || selectedSala === 'salaAdicional' || selectedSala === 'salaAdicional2'
            ? currentRoom.layout.every(col => !col.pcs || col.pcs.every(pc => Array.from(selectedList).some(s => s.id === pc.id)))
            : currentRoom.layout.every(fila => 
                (!fila.izquierda || fila.izquierda.every(pc => Array.from(selectedList).some(s => s.id === pc.id))) &&
                (!fila.derecha || fila.derecha.every(pc => Array.from(selectedList).some(s => s.id === pc.id)))
                ))
            ? '✕ Deseleccionar Todo'
            : 'Seleccionar Todo'
            }
        </button>

        {/* Botón Ejecutar en Todos */}
        <button 
            onClick={() => {
            const allPCs = [];
            const isSingleColumn = selectedSala === 'sala1' || selectedSala === 'salaAdicional' || selectedSala === 'salaAdicional2';
            const salaNum = getSalaNumber(selectedSala);
            if (isSingleColumn) {
                currentRoom.layout.forEach(col => {
                if (col.pcs) col.pcs.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum }));
                });
            } else {
                currentRoom.layout.forEach(fila => {
                if (fila.izquierda) fila.izquierda.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum }));
                if (fila.derecha) fila.derecha.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum }));
                });
            }
            setSelectedList(new Set(allPCs));
            setTimeout(() => setShowBulkModal(true), 100);
            }}
            className="group px-4 py-2 text-xs font-medium rounded-lg border border-purple-500/40 hover:border-purple-400 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-2.5 hover:shadow-[0_0_15px_rgba(168,85,247,0.1)]"
        >
            Ejecutar en TODOS
        </button>
        </div>

        {/* Mostrar cantidad seleccionada */}
        {selectedList.size > 0 && (
        <span className="text-xs font-mono text-gray-400 ml-auto">
            Seleccionados: <b className="text-cyan-400">{selectedList.size}</b>
        </span>
        )}
    </div>

    {/* Barra de acciones masivas - solo cuando hay selección */}
    <AnimatePresence>
        {selectedList.size > 0 && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="z-20 bg-black/60 border border-cyan-500/20 rounded-lg p-3 flex flex-wrap items-center gap-3">
            {/* Botón principal para abrir modal */}
            <button 
            onClick={() => setShowBulkModal(true)} 
            className="px-4 py-1.5 text-xs font-bold rounded-lg border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
            >
            <Terminal size={14} />
            Panel de Acciones ({selectedList.size})
            </button>

            {/* Acciones rápidas inline */}
            <div className="flex items-center gap-1">
            {[
                { id: 'power', label: 'Apagar', icon: Power, cls: 'hover:bg-red-500/20 hover:text-red-400' },
                { id: 'start', label: 'Encender', icon: Zap, cls: 'hover:bg-green-500/20 hover:text-green-400' },
                { id: 'restart', label: 'Reiniciar', icon: RotateCw, cls: 'hover:bg-blue-500/20 hover:text-blue-400' },
            ].map(a => (
                <button key={a.id} disabled={!!actionLoading} onClick={() => handleBulkAction(a.id)} title={a.label} className={`p-1.5 text-xs rounded border border-white/5 text-gray-400 flex items-center gap-1 ${a.cls}`}>
                {actionLoading === `bulk-${a.id}` ? <RotateCw size={12} className="animate-spin"/> : <a.icon size={12}/>}
                </button>
            ))}
            </div>
            
            <button onClick={() => setSelectedList(new Set())} className="ml-auto text-xs text-gray-500 hover:text-gray-300">✕ Limpiar</button>
        </motion.div>
        )}
    </AnimatePresence>

    {/* Grid Canvas - LOWERED Z-INDEX */}
    <ScrollArea className="flex-1 rounded-2xl border border-white/5 bg-black/20 p-6 relative z-0 overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20" 
            style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        
        <div className="relative z-10">
        {selectedSala === 'sala1' ? (
            <div className="flex flex-col gap-8 lg:gap-12 w-full">
            {/* VENTANA - Título superior */}
            <div className="w-full text-center">
                <div className="text-lg font-mono text-cyan-400 uppercase tracking-widest font-bold border-b-2 border-cyan-500/50 pb-3 inline-block px-8">
                VENTANA
                </div>
            </div>

            {/* Contenedor principal - Lado Izquierdo y Derecho */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full justify-center">
                {/* LADO IZQUIERDO: 3 Pares de Filas de 4 PCs */}
                <div className="flex flex-col gap-8 w-full lg:w-auto">
                {/* Filas 1-2 */}
                <div className="flex flex-col gap-3">
                {currentRoom.layout.slice(0, 2).map((row, idx) => (
                    <div key={`row-pair1-${idx}`} className="flex items-center gap-4">
                    <div className="text-sm font-mono text-cyan-400 uppercase tracking-wider min-w-12 text-right">
                        COL {String.fromCharCode(70 - idx)}
                    </div>
                    <div className="p-3 md:p-4 rounded-lg bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-colors">
                        <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                        {row.pcs && row.pcs.slice(0, 4).map(pc => <PCCard key={pc.id} pc={pc} />)}
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                {/* Filas 3-4 */}
                <div className="flex flex-col gap-3">
                {currentRoom.layout.slice(2, 4).map((row, idx) => (
                    <div key={`row-pair2-${idx}`} className="flex items-center gap-4">
                    <div className="text-sm font-mono text-cyan-400 uppercase tracking-wider min-w-12 text-right">
                        COL {String.fromCharCode(68 - idx)}
                    </div>
                    <div className="p-3 md:p-4 rounded-lg bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-colors">
                        <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                        {row.pcs && row.pcs.slice(0, 4).map(pc => <PCCard key={pc.id} pc={pc} />)}
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                {/* Filas 5-6 */}
                <div className="flex flex-col gap-3">
                {currentRoom.layout.slice(4, 6).map((row, idx) => (
                    <div key={`row-pair3-${idx}`} className="flex items-center gap-4">
                    <div className="text-sm font-mono text-cyan-400 uppercase tracking-wider min-w-12 text-right">
                        COL {String.fromCharCode(66 - idx)}
                    </div>
                    <div className="p-3 md:p-4 rounded-lg bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-colors">
                        <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                        {row.pcs && row.pcs.slice(0, 4).map(pc => <PCCard key={pc.id} pc={pc} />)}
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>

            {/* LADO DERECHO: 2 Columnas de 6 PCs cada una */}
            <div className="flex flex-col gap-8 w-full lg:w-auto justify-center lg:justify-center">
                <div className="flex gap-6 md:gap-8 justify-center">
                {currentRoom.layout.slice(6, 8).map((col, idx) => (
                    <div key={`col-${idx}`} className="flex flex-col gap-2 md:gap-3">
                    <div className="text-sm font-mono text-cyan-400 uppercase tracking-wider text-center">FILA {idx + 1}</div>
                    <div className="p-3 md:p-4 rounded-lg bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-colors flex flex-col gap-2 md:gap-3">
                        {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
            </div>
        ) : (selectedSala === 'salaAdicional' || selectedSala === 'salaAdicional2') ? (
            <div className="space-y-6 md:space-y-12 flex flex-col items-center w-full">
            {/* 3 Pares de Columnas Verticales - Responsivas */}
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 w-full flex-wrap md:flex-nowrap items-start">
                {/* Grupo 1 */}
                <div className="flex gap-1 w-full md:w-auto justify-center">
                {currentRoom.layout.slice(0, 2).map((col, idx) => (
                    <div key={idx} className="flex flex-col gap-2 md:gap-4 p-3 md:p-6 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                    <div className="text-[9px] md:text-[10px] text-cyan-500 font-mono text-center uppercase tracking-wider mb-1 md:mb-2">COL-{String.fromCharCode(65 + idx)}</div>
                    {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                    </div>
                ))}
                </div>
                
                {/* TABLERO*/}
                {selectedSala === 'salaAdicional2' && (
                <div className="hidden lg:flex flex-col justify-center items-center gap-2">
                    <div className="w-60 h-8 bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 border-yellow-600/50 rounded-lg flex items-center justify-center">
                    <div className="text-[10px] font-mono text-yellow-500 uppercase tracking-wider font-bold text-center">TABLERO</div>
                    </div>
                </div>
                )}
                
                {/* Grupo 2 */}
                <div className="flex gap-1 w-full md:w-auto justify-center">
                {currentRoom.layout.slice(2, 4).map((col, idx) => (
                    <div key={idx + 2} className="flex flex-col gap-2 md:gap-4 p-3 md:p-6 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                    <div className="text-[9px] md:text-[10px] text-cyan-500 font-mono text-center uppercase tracking-wider mb-1 md:mb-2">COL-{String.fromCharCode(67 + idx)}</div>
                    {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                    </div>
                ))}
                </div>
                
                {/* Grupo 3 + Título SALA 1 */}
                <div className="flex gap-16 w-full md:w-auto justify-center items-start">
                <div className="flex gap-1">
                    {currentRoom.layout.slice(4, 6).map((col, idx) => (
                    <div key={idx + 4} className="flex flex-col gap-2 md:gap-4 p-3 md:p-6 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                        <div className="text-[9px] md:text-[10px] text-cyan-500 font-mono text-center uppercase tracking-wider mb-1 md:mb-2">COL-{String.fromCharCode(69 + idx)}</div>
                        {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                    </div>
                    ))}
                </div>
                
                {/* Línea del porte de la sala - Más grande y visible */}
                <div className="hidden lg:flex flex-col items-center gap-4 h-full">
                    <div className="w-2 bg-gradient-to-b from-transparent via-red-500 to-transparent" style={{ height: '500px' }} />
                </div>
                
                {/* Título al lado de Columna F - Más grande y visible */}
                <div className="hidden lg:flex flex-col justify-center items-center">
                    <div className="text-xl font-mono text-red-400 uppercase tracking-widest font-bold py-16 whitespace-nowrap">
                    {selectedSala === 'salaAdicional' ? (
                        <>SALA<br />1</>
                    ) : (
                        <>SALA<br />2</>
                    )}
                    </div>
                </div>
                </div>
            </div>

            {/* Filas Horizontales - Responsivas */}
            <div className="w-full flex flex-col gap-4 md:gap-8">
                {currentRoom.layout.slice(6, 8).map((row, idx) => (
                <div key={idx + 6} className="flex justify-center">
                    <div className="w-full max-w-2xl md:max-w-4xl p-3 md:p-5 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden">
                    {/* Grid Background */}
                    <div className="absolute inset-0 z-0 opacity-10" 
                            style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '80px 80px' }} 
                    />
                    <div className="relative z-10">
                        <div className="text-[9px] md:text-xs text-cyan-500 font-mono mb-3 md:mb-4 border-b border-cyan-500/20 pb-2">FILA {idx + 1}</div>
                        <div className="flex flex-wrap justify-center gap-2 md:gap-3">{row.pcs && row.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}</div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        ) : (
            // LÓGICA DE RENDERIZADO ESTÁNDAR PARA SALAS 2, 3 Y 4 - RESPONSIVA
            <div className="space-y-6 md:space-y-8 w-full">
            {/* TV - Adelante de la sala */}
            <div className="w-full text-center">
                <div className="text-lg font-mono text-cyan-400 uppercase tracking-widest font-bold border-b-2 border-cyan-500/50 pb-3 inline-block px-8">
                TV
                </div>
            </div>

            {/* Filas de la sala */}
            <div className="space-y-4 md:space-y-6">
                {currentRoom.layout.map((fila, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-3 md:gap-6 p-3 md:p-4 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                    {/* Fila Izquierda */}
                    <div className="flex-1">
                        <div className="text-[9px] md:text-[10px] text-cyan-500/70 font-mono mb-2 md:mb-3 uppercase tracking-wider border-b border-white/5 pb-1">Fila {i + 1} - Sector A</div>
                        <div className={`flex flex-wrap gap-2 md:gap-3 ${i === currentRoom.layout.length - 1 ? 'justify-center' : (fila.izquierda?.length <= 2 ? 'justify-start' : 'justify-center')}`}>
                        {fila.izquierda.map(pc => <PCCard key={pc.id} pc={pc} />)}
                        {i === currentRoom.layout.length - 1 && fila.izquierda.length < 4 &&
                            Array.from({ length: 4 - fila.izquierda.length }).map((_, idxGhost) => (
                            <div key={`ghost-left-${i}-${idxGhost}`} className="min-w-[120px] opacity-0 pointer-events-none" />
                            ))
                        }
                        </div>
                    </div>
                    
                    {/* Separador vertical decorativo */}
                    <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />

                    {/* Fila Derecha */}
                    <div className="flex-1">
                        <div className="text-[9px] md:text-[10px] text-purple-500/70 font-mono mb-2 md:mb-3 uppercase tracking-wider border-b border-white/5 pb-1">Fila {i + 1} - Sector B</div>
                        <div className={`flex flex-wrap gap-2 md:gap-3 ${fila.derecha?.length <= 2 ? 'justify-start' : 'justify-center'}`}>
                        {i >= 2 && fila.derecha?.length === 3 && (
                            <div className="min-w-[120px] opacity-0 pointer-events-none" />
                        )}
                        {fila.derecha.map(pc => <PCCard key={pc.id} pc={pc} />)}
                        </div>
                    </div>
                </div>
                ))}
            </div>

            {/* SALIDA - Atrás de la sala */}
            <div className="w-full text-center">
                <div className="text-lg font-mono text-red-400 uppercase tracking-widest font-bold border-t-2 border-red-500/50 pt-3 inline-block px-8">
                SALIDA
                </div>
            </div>
            </div>
        )}
        </div>
    </ScrollArea>

    {/* PC Modal */}
    <AnimatePresence>
        {selectedPC && (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={() => setSelectedPC(null)}
        >
            <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-[#0f0f0f] border border-cyan-500/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            >
            <div className="bg-gradient-to-r from-cyan-900/20 to-transparent p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                <h3 className="text-xl font-bold text-white font-mono">{selectedPC.id}</h3>
                <p className="text-xs text-cyan-400 font-mono">{selectedPC.ip}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${selectedPC.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {selectedPC.status?.toUpperCase?.()}
                </div>
            </div>
            
            <div className="p-3 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
                {[
                { id: 'power', label: 'Apagar', icon: Power, color: 'hover:bg-red-500/20 hover:text-red-400', span: false },
                { id: 'start', label: 'Encender (WOL)', icon: Zap, color: 'hover:bg-green-500/20 hover:text-green-400', span: false },
                { id: 'restart', label: 'Reiniciar', icon: RotateCw, color: 'hover:bg-blue-500/20 hover:text-blue-400', span: false },
                { id: 'lock', label: 'Bloquear Sesión', icon: Lock, color: 'hover:bg-orange-500/20 hover:text-orange-400', span: false },
                { id: 'format', label: 'Limpiar', icon: HardDrive, color: 'hover:bg-yellow-500/20 hover:text-yellow-400', span: false },
                { id: 'install', label: 'Instalar Apps', icon: Package, color: 'hover:bg-purple-500/20 hover:text-purple-400', span: false },
                { id: 'report', label: 'Reportar Problema', icon: AlertCircle, color: 'hover:bg-orange-500/20 hover:text-orange-400', span: true },
                ].map(action => (
                <button
                    key={action.id}
                    onClick={() => {
                    if (action.id === 'report') {
                        setSelectedPCForReport(selectedPC);
                        setShowReportModal(true);
                        setSelectedPC(null);
                    } else {
                        handleAction(action.id, selectedPC.id, selectedPC.ip, selectedPC.dbId);
                    }
                    }}
                    disabled={actionLoading !== null}
                    className={`p-2 md:p-3 rounded-lg border border-white/5 bg-black/40 text-gray-400 transition-all flex items-center justify-center gap-2 text-xs md:text-sm font-medium ${action.color} ${action.span ? 'col-span-2' : ''}`}
                >
                    {actionLoading === `${selectedPC.id}-${action.id}` ? (
                    <RotateCw className="animate-spin" size={16} />
                    ) : (
                    <action.icon size={16} />
                    )}
                    {action.label}
                </button>
                ))}
            </div>
            
            <div className="p-4 bg-black/40 border-t border-white/5 text-center">
                <button onClick={() => setSelectedPC(null)} className="text-xs text-gray-500 hover:text-white transition-colors">CANCELAR OPERACIÓN</button>
            </div>
            </motion.div>
        </motion.div>
        )}
    </AnimatePresence>

    {/* Bulk Actions Modal */}
    <AnimatePresence>
        {showBulkModal && selectedList.size > 0 && (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={() => setShowBulkModal(false)}
        >
            <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-[#0f0f0f] border border-cyan-500/30 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-900/20 to-transparent p-6 border-b border-white/5">
                <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-white font-mono">{selectedList.size} Computadores Seleccionados</h3>
                    <p className="text-xs text-cyan-400 font-mono mt-1">Acciones masivas</p>
                </div>
                <button 
                    onClick={() => setShowBulkModal(false)}
                    className="text-gray-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
                </div>
                
                {/* Selected PCs List */}
                <div className="mt-4 max-h-24 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Array.from(selectedList).map((pcItem) => {
                    const status = deviceStatusOverrides[pcItem.ip]?.status || 'unknown';
                    return (
                        <div key={pcItem.id} className="text-xs bg-black/40 p-2 rounded border border-white/10 flex justify-between items-center">
                        <div>
                            <div className="text-white font-mono">{pcItem.id}</div>
                            <div className="text-gray-500 text-[10px]">{pcItem.ip}</div>
                        </div>
                        <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>
                    );
                    })}
                </div>
                </div>
            </div>
            
            {/* Actions Grid */}
            <div className="p-3 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
                {[
                { id: 'power', label: 'Apagar', icon: Power, color: 'hover:bg-red-500/20 hover:text-red-400', span: false },
                { id: 'start', label: 'Encender (WOL)', icon: Zap, color: 'hover:bg-green-500/20 hover:text-green-400', span: false },
                { id: 'restart', label: 'Reiniciar', icon: RotateCw, color: 'hover:bg-blue-500/20 hover:text-blue-400', span: false },
                { id: 'lock', label: 'Bloquear Sesión', icon: Lock, color: 'hover:bg-orange-500/20 hover:text-orange-400', span: false },
                { id: 'format', label: 'Limpiar', icon: HardDrive, color: 'hover:bg-yellow-500/20 hover:text-yellow-400', span: false },
                { id: 'install', label: 'Instalar Apps', icon: Package, color: 'hover:bg-purple-500/20 hover:text-purple-400', span: false },
                ].map(action => (
                <button
                    key={action.id}
                    onClick={() => handleBulkAction(action.id)}
                    disabled={actionLoading !== null}
                    className={`p-3 rounded-lg border border-white/5 bg-black/40 text-gray-400 transition-all flex items-center justify-center gap-2 text-sm font-medium ${action.color} ${action.span ? 'col-span-2' : ''}`}
                >
                    {actionLoading === `bulk-${action.id}` ? (
                    <RotateCw className="animate-spin" size={16} />
                    ) : (
                    <action.icon size={16} />
                    )}
                    {action.label}
                </button>
                ))}
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-black/40 border-t border-white/5 text-center">
                <button onClick={() => setShowBulkModal(false)} className="text-xs text-gray-500 hover:text-white transition-colors">CANCELAR OPERACIÓN</button>
            </div>
            </motion.div>
        </motion.div>
        )}
    </AnimatePresence>

    {/* Report Problem Modal */}
    <ReportProblemModal
        isOpen={showReportModal}
        onClose={() => {
        setShowReportModal(false);
        setSelectedPCForReport(null);
        }}
        selectedPC={selectedPCForReport}
        selectedSala={selectedSala}
        onSubmit={handleReportSubmit}
    />
    </div>
);
};

export default ComputerMonitoringSection;