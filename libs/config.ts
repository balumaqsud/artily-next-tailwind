export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableOptions = ["propertyBarter", "propertyRent"];

const thisYear = new Date().getFullYear();

export const propertyYears: any = [];

for (let i = 1970; i <= thisYear; i++) {
  propertyYears.push(String(i));
}

export const propertySquare = [0, 25, 50, 75, 100, 125, 150, 200, 300, 500];

export const Messages = {
  error1: "Something went wrong!",
  error2: "Please login first!",
  error3: "Please fulfill all inputs!",
  error4: "Message is empty!",
  error5: "Only images with jpeg, jpg, png format allowed!",
};

export const topPropertyRank = 4;

interface Collection {
  _id: string;
  title: string;
  image: string;
}

export const fallbackCollections: Collection[] = [
  { _id: "CLOTHING", title: "CLOTHING", image: "/banner/main.jpg" },
  {
    _id: "HOME_LIVING",
    title: "HOME AND LIVING",
    image: "/banner/main7.jpg",
  },
  { _id: "ACCESSORY", title: "ACCESSORY", image: "/banner/main.jpg" },
  { _id: "HANDMADE", title: "HANDMADE", image: "/banner/main7.jpg" },
  { _id: "VINTAGE", title: "VINTAGE", image: "/banner/main.jpg" },
  {
    _id: "CRAFT_SUPPLIES",
    title: "CRAFT SUPPLIES",
    image: "/banner/main7.jpg",
  },
  { _id: "JEWELRY", title: "JEWELRY", image: "/banner/main.jpg" },
  { _id: "PET_PRODUCTS", title: "PET PRODUCTS", image: "/banner/main7.jpg" },
  {
    _id: "ART_COLLECTABLES",
    title: "ART AND COLLECTABLES",
    image: "/banner/main.jpg",
  },
  { _id: "CHILDREN", title: "CHILDREN", image: "/banner/main7.jpg" },
];
