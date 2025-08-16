export const REACT_APP_API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3007";
export const REACT_APP_API_GRAPHQL_URL =
  process.env.REACT_APP_API_GRAPHQL_URL || `${REACT_APP_API_URL}/graphql`;
export const REACT_APP_API_WS =
  process.env.REACT_APP_API_WS || "ws://localhost:3007";

export const Messages = {
  error1: "Something went wrong!",
  error2: "Please login first!",
  error3: "Please fulfill all inputs!",
  error4: "Message is empty!",
  error5: "Only images with jpeg, jpg, png format allowed!",
};

export const topProductRank = 4;

interface Collection {
  _id: string;
  title: string;
  image: string;
}

export const fallbackCollections: Collection[] = [
  {
    _id: "HOME_LIVING",
    title: "HOME AND LIVING",
    image: "/collections/home.jpeg",
  },
  {
    _id: "CRAFT_SUPPLIES",
    title: "CRAFT SUPPLIES",
    image: "/collections/crafts.jpeg",
  },
  {
    _id: "PET_PRODUCTS",
    title: "PET PRODUCTS",
    image: "/collections/pet.jpeg",
  },
  { _id: "HANDMADE", title: "HANDMADE", image: "/collections/handmade.jpeg" },
  { _id: "CLOTHING", title: "CLOTHING", image: "/collections/clothing.jpg" },
  { _id: "VINTAGE", title: "VINTAGE", image: "/collections/vintage.jpeg" },
  { _id: "CHILDREN", title: "CHILDREN", image: "/collections/children.jpeg" },

  { _id: "JEWELRY", title: "JEWELRY", image: "/collections/jewelry.jpeg" },

  {
    _id: "ART_COLLECTABLES",
    title: "ART AND COLLECTABLES",
    image: "/collections/art.jpeg",
  },
  {
    _id: "ACCESSORY",
    title: "ACCESSORY",
    image: "/collections/accessories.jpeg",
  },
];
