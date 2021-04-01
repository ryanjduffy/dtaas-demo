export const typeToLabel = (type) => {
  const map = {
    BarrierConcrete: "Concrete Barrier",
    BarrierMetal: "Barrier Metal",
    Bicycle: "Bicycle",
    ChairWood: "Wooden Chair",
    Dumpster: "Dumpster",
    LadderExtension: "Extension Ladder",
    Mailbox: "Mailbox",
    PortableToilet: "Portable Toilet",
    TableWood: "Wooden Table",
    Tire: "Tire",
    BrokenDownSedan: "Stalled Vehicle",
    AmbulanceSedan: "Ambulance",
    TrafficCone: "Traffic Cone",
    Pothole: "Pothole"
  };
  return map[type] || type;
};

export const normalizeType = (type) =>
  type
    .replace(/^bicycle$/, "Bicycle")
    .replace(/^"/, "")
    .replace(/"$/, "");

export default typeToLabel;
