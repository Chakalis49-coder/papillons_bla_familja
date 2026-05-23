const width = 850;
const height = 700; // ✅ un peu plus grand pour éviter coupure
const offsetY = -20;

// ✅ SVG RESPONSIVE (FIX PRINCIPAL)
const svg = d3.select("#tree")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`) // ✅ dynamique
    .style("width", "100%")
    .style("height", "auto"); // ✅ IMPORTANT

// ------------------
// ✅ NODES
// ------------------

const nodes = [
    { id: "profil-fondateur1", name: "Fondateur Pépito", x: 283, y: 80 + offsetY, role: "founder", img: "img/fondateur_1.jpeg" },
    { id: "profil-fondateur2", name: "Fondateur Vikédium", x: 567, y: 80 + offsetY, role: "founder", img: "img/fondateur_2.jpeg" },

    { id: "profil-directrice1", name: "Directrice Papillons", x: 283, y: 220 + offsetY, role: "director", img: "img/directrice_1.jpeg" },
    { id: "profil-directrice2", name: "Directrice Pockettelande", x: 567, y: 220 + offsetY, role: "director", img: "img/directrice_2.jpeg" },

    { id: "profil-manager1", name: "Manageur Nexuzio", x: 150, y: 380 + offsetY, role: "manager", img: "img/manager_1.jpeg" },
    { id: "profil-manager2", name: "Manageuse Licorne", x: 425, y: 380 + offsetY, role: "manager", img: "img/manager_2.jpeg" },
    { id: "profil-manager3", name: "Manageur Nounours", x: 700, y: 380 + offsetY, role: "manager", img: "img/manager_3.jpeg" },

    { id: "profil-agent1", name: "Agent Artémis", x: 150, y: 500 + offsetY, img: "img/agent_1.jpeg" },
    { id: "profil-agent2", name: "Agent Chelsea", x: 150, y: 620 + offsetY, img: "img/agent_2.jpeg" },

    { id: "profil-agent3", name: "Agent Jerem", x: 425, y: 500 + offsetY, img: "img/agent_3.jpeg" },
    { id: "profil-agent4", name: "Agente Manon", x: 425, y: 620 + offsetY, img: "img/agent_4.jpeg" },

    { id: "profil-agent5", name: "Agente Dania", x: 700, y: 500 + offsetY, img: "img/agent_5.jpeg" },
    { id: "profil-agent6", name: "Agent Chantal", x: 700, y: 620 + offsetY, img: "img/agent_6.jpeg" }
];

// ------------------
// ✅ LIENS
// ------------------

const links = [
    ["profil-fondateur1", "profil-directrice1"],
    ["profil-fondateur1", "profil-directrice2"],
    ["profil-fondateur2", "profil-directrice1"],
    ["profil-fondateur2", "profil-directrice2"],

    ["profil-directrice1", "profil-manager1"],
    ["profil-directrice1", "profil-manager2"],
    ["profil-directrice1", "profil-manager3"],

    ["profil-directrice2", "profil-manager1"],
    ["profil-directrice2", "profil-manager2"],
    ["profil-directrice2", "profil-manager3"],

    ["profil-manager1", "profil-agent1"],
    ["profil-manager1", "profil-agent2"],

    ["profil-manager2", "profil-agent3"],
    ["profil-manager2", "profil-agent4"],

    ["profil-manager3", "profil-agent5"],
    ["profil-manager3", "profil-agent6"]
];

// ------------------
// ✅ COULEURS
// ------------------

function getColor(sourceId) {
    const node = nodes.find(n => n.id === sourceId);

    if (!node) return "#00cfff";
    if (node.role === "director") return "#00ffcc";
    if (node.role === "manager") return "#ff00cc";

    return "#00cfff";
}

// ------------------
// ✅ LIGNES
// ------------------

links.forEach(link => {

    const source = nodes.find(n => n.id === link[0]);
    const target = nodes.find(n => n.id === link[1]);

    if (!source || !target) return;

    const midY = (source.y + target.y) / 2;

    svg.append("line")
        .attr("x1", source.x)
        .attr("y1", source.y)
        .attr("x2", source.x)
        .attr("y2", midY)
        .attr("stroke", getColor(source.id))
        .attr("stroke-width", 2);

    svg.append("line")
        .attr("x1", source.x)
        .attr("y1", midY)
        .attr("x2", target.x)
        .attr("y2", midY)
        .attr("stroke", getColor(source.id))
        .attr("stroke-width", 2);

    svg.append("line")
        .attr("x1", target.x)
        .attr("y1", midY)
        .attr("x2", target.x)
        .attr("y2", target.y)
        .attr("stroke", getColor(source.id))
        .attr("stroke-width", 2);
});

// ------------------
// ✅ NODES
// ------------------

const node = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .style("cursor", "pointer")
    .on("click", (event, d) => {
        window.location.href = `profils/${d.id}.html`;
    });

// IMAGE
node.append("image")
    .attr("href", d => d.img)
    .attr("x", -25)
    .attr("y", -55)
    .attr("width", 50)
    .attr("height", 50)
    .attr("clip-path", "circle(25px at 25px 25px)");

// CARD
node.append("rect")
    .attr("x", -70)
    .attr("y", -5)
    .attr("width", 140)
    .attr("height", 55)
    .attr("rx", 12)
    .attr("fill", "rgba(0,0,0,0.6)")
    .attr("stroke", d => {
        if (d.role === "founder") return "#00cfff";
        if (d.role === "director") return "#00ffcc";
        if (d.role === "manager") return "#ff00cc";
        return "#ffffff33";
    })
    .attr("stroke-width", 2);

// TEXTE
node.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", "white")
    .style("font-weight", "500")
    .attr("y", 20)
    .each(function(d) {

        const words = d.name.split(" ");
        const text = d3.select(this);

        let line1 = words[0];
        let line2 = words.slice(1).join(" ");

        text.append("tspan")
            .text(line1)
            .attr("x", 0)
            .attr("dy", line2 ? "-6" : "0");

        if (line2) {
            text.append("tspan")
                .text(line2)
                .attr("x", 0)
                .attr("dy", "14");
        }
    });
