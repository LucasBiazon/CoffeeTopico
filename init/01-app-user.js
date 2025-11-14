
const dbName = 'coffee_recs';
const dbRef = db.getSiblingDB(dbName);

try {
  dbRef.createUser({
    user: 'app_user',
    pwd: 'app_pass',
    roles: [{ role: 'readWrite', db: dbName }]
  });
  print(`[init] usuário criado em ${dbName}: app_user`);
} catch (e) {
  print(`[init] createUser skip: ${e.message}`);
}

try {
  dbRef.createCollection('coffees');
  print('[init] collection coffees criada');
} catch (e) {
  print(`[init] createCollection skip: ${e.message}`);
}

const coffees = [
  {
    type: "bean",
    name: "Catuaí Amarelo",
    brand: "Fazenda Santa Clara",
    origin_country: "Brazil",
    roast: "medium",
    tasting_notes: ["caramelo", "avelã", "chocolate ao leite"],
    attributes: { acidity: 3, sweetness: 4, bitterness: 2, body: 4, aroma: 5 },
    brew_methods: ["espresso", "v60", "aeropress"],
    price: { currency: "BRL", value: 65 },
    bag_price: 65,
    bag_size_g: 250,
    contains: [],
    available: true,
    image_url: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13"
  },
  {
    type: "bean",
    name: "Bourbon Vermelho",
    brand: "Serra do Caparaó",
    origin_country: "Brazil",
    roast: "light",
    tasting_notes: ["floral", "frutas amarelas", "mel"],
    attributes: { acidity: 4, sweetness: 4, bitterness: 1, body: 3, aroma: 5 },
    brew_methods: ["v60", "kalita", "chemex"],
    price: { currency: "BRL", value: 78 },
    bag_price: 78,
    bag_size_g: 250,
    contains: [],
    available: true,
    image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
  },
  {
    type: "bean",
    name: "Ethiopia Yirgacheffe",
    brand: "Origin Select",
    origin_country: "Ethiopia",
    roast: "light",
    tasting_notes: ["jasmim", "bergamota", "chá preto"],
    attributes: { acidity: 5, sweetness: 3, bitterness: 1, body: 2, aroma: 5 },
    brew_methods: ["v60", "aeropress", "origami"],
    price: { currency: "BRL", value: 95 },
    bag_price: 95,
    bag_size_g: 200,
    contains: [],
    available: true,
    image_url: "https://images.unsplash.com/photo-1459755486867-b55449bb39ff"
  },
  {
    type: "bean",
    name: "Colombia Supremo",
    brand: "Andes Coffee",
    origin_country: "Colombia",
    roast: "medium",
    tasting_notes: ["caramelo", "cítrico", "nozes"],
    attributes: { acidity: 3, sweetness: 4, bitterness: 2, body: 3, aroma: 4 },
    brew_methods: ["espresso", "mokapot", "v60"],
    price: { currency: "BRL", value: 72 },
    bag_price: 72,
    bag_size_g: 250,
    contains: [],
    available: true,
    image_url: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38"
  },
  {
    type: "bean",
    name: "Blend Espresso Casa",
    brand: "CoffeeTópico Roasters",
    origin_country: "Brazil",
    roast: "dark",
    tasting_notes: ["cacau", "caramelo", "baunilha"],
    attributes: { acidity: 2, sweetness: 3, bitterness: 3, body: 5, aroma: 4 },
    brew_methods: ["espresso", "mokapot"],
    price: { currency: "BRL", value: 58 },
    bag_price: 58,
    bag_size_g: 500,
    contains: [],
    available: true,
    image_url: "https://images.unsplash.com/photo-1602321059213-a2c92f5ed278"
  },
  {
    type: "drink",
    name: "Espresso",
    brand: "CoffeeTópico Bar",
    origin_country: "Brazil",
    roast: "dark",
    tasting_notes: ["cacau", "nozes"],
    attributes: { acidity: 2, sweetness: 2, bitterness: 3, body: 5, aroma: 4 },
    brew_methods: ["espresso"],
    price: { currency: "BRL", value: 6 },
    contains: [],
    available: true,
    image_url: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1"
  },
  {
    type: "drink",
    name: "Cappuccino",
    brand: "CoffeeTópico Bar",
    origin_country: "Brazil",
    roast: "dark",
    tasting_notes: ["chocolate", "caramelo"],
    attributes: { acidity: 2, sweetness: 4, bitterness: 2, body: 5, aroma: 4 },
    brew_methods: ["espresso", "steam-milk"],
    price: { currency: "BRL", value: 12 },
    contains: ["milk"],
    available: true,
    image_url: "https://images.unsplash.com/photo-1513623935135-c896b59073c4"
  },
  {
    type: "drink",
    name: "Latte",
    brand: "CoffeeTópico Bar",
    origin_country: "Brazil",
    roast: "medium",
    tasting_notes: ["leite", "baunilha"],
    attributes: { acidity: 1, sweetness: 4, bitterness: 1, body: 4, aroma: 3 },
    brew_methods: ["espresso", "steam-milk"],
    price: { currency: "BRL", value: 13 },
    contains: ["milk"],
    available: true,
    image_url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814"
  },
  {
    type: "drink",
    name: "Mocha",
    brand: "CoffeeTópico Bar",
    origin_country: "Brazil",
    roast: "medium",
    tasting_notes: ["chocolate", "cremoso"],
    attributes: { acidity: 1, sweetness: 5, bitterness: 1, body: 4, aroma: 4 },
    brew_methods: ["espresso", "steam-milk"],
    price: { currency: "BRL", value: 15 },
    contains: ["milk"],
    available: true,
    image_url: "https://images.unsplash.com/photo-1517256673644-36ad11246d21"
  },
  {
    type: "drink",
    name: "Cold Brew",
    brand: "CoffeeTópico Bar",
    origin_country: "Brazil",
    roast: "light",
    tasting_notes: ["suave", "frutado"],
    attributes: { acidity: 3, sweetness: 2, bitterness: 1, body: 2, aroma: 3 },
    brew_methods: ["cold-brew"],
    price: { currency: "BRL", value: 14 },
    contains: [],
    available: true,
    image_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772"
  }
];


coffees.forEach(c => {
  const exists = dbRef.coffees.findOne({ name: c.name, brand: c.brand });
  if (!exists) {
    dbRef.coffees.insertOne(c);
    print('[seed] inserido: ' + c.name);
  } else {
    print('[seed] já existe, pulando: ' + c.name);
  }
});

dbRef.coffees.createIndex({ available: 1 });
dbRef.coffees.createIndex({ roast: 1 });
dbRef.coffees.createIndex({ type: 1, brand: 1 });

print('[init] seed de coffees finalizado.');
