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
    Pothole: "Pothole",
  };
  return map[type] || type;
};

export const typeToPlaceholderImage = (type) => {
  const map = {
    BarrierConcrete: "/images/barrierconcrete.png",
    BarrierMetal: "/images/barriermetal.png",
    Bicycle: "/images/bicycle.png",
    ChairWood: "/images/chairwood.png",
    Dumpster: "/images/dumpster.png",
    LadderExtension: "/images/ladderextension.png",
    Mailbox: "/images/mailbox.png",
    PortableToilet: "/images/portabletoilet.png",
    TableWood: "/images/tablewood.png",
    Tire: "/images/tire.png",
    BrokenDownSedan: "/images/sedan.png",
    AmbulanceSedan: "/images/ambulance.png",
    Pothole: "/images/pothole.png",
  };
  return map[type] || type;
};

export const normalizeType = (type) =>
  type
    .replace(/^bicycle$/, "Bicycle")
    .replace(/^"/, "")
    .replace(/"$/, "");

export default typeToLabel;
