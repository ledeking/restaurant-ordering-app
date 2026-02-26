import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "appetizers" },
      update: {},
      create: {
        name: "Appetizers",
        slug: "appetizers",
        description: "Start your meal with these delicious appetizers",
      },
    }),
    prisma.category.upsert({
      where: { slug: "burgers" },
      update: {},
      create: {
        name: "Burgers",
        slug: "burgers",
        description: "Juicy, flavorful burgers made to order",
      },
    }),
    prisma.category.upsert({
      where: { slug: "pizza" },
      update: {},
      create: {
        name: "Pizza",
        slug: "pizza",
        description: "Handcrafted pizzas with fresh ingredients",
      },
    }),
    prisma.category.upsert({
      where: { slug: "pasta" },
      update: {},
      create: {
        name: "Pasta",
        slug: "pasta",
        description: "Classic Italian pasta dishes",
      },
    }),
    prisma.category.upsert({
      where: { slug: "salads" },
      update: {},
      create: {
        name: "Salads",
        slug: "salads",
        description: "Fresh, healthy salads",
      },
    }),
    prisma.category.upsert({
      where: { slug: "desserts" },
      update: {},
      create: {
        name: "Desserts",
        slug: "desserts",
        description: "Sweet treats to end your meal",
      },
    }),
    prisma.category.upsert({
      where: { slug: "drinks" },
      update: {},
      create: {
        name: "Drinks",
        slug: "drinks",
        description: "Refreshing beverages",
      },
    }),
  ]);

  const [appetizers, burgers, pizza, pasta, salads, desserts, drinks] = categories;

  // Create menu items
  const menuItems = [
    // Appetizers
    {
      name: "Mozzarella Sticks",
      slug: "mozzarella-sticks",
      description: "Crispy fried mozzarella with marinara sauce",
      price: 8.99,
      categoryId: appetizers.id,
      featured: true,
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
    },
    {
      name: "Buffalo Wings",
      slug: "buffalo-wings",
      description: "Spicy chicken wings with blue cheese dip",
      price: 12.99,
      categoryId: appetizers.id,
      featured: false,
      image: "https://images.unsplash.com/photo-1527477396000-e27137b5310f?w=800",
    },
    {
      name: "Nachos Supreme",
      slug: "nachos-supreme",
      description: "Loaded nachos with cheese, jalapeños, and sour cream",
      price: 10.99,
      categoryId: appetizers.id,
      featured: false,
    },
    {
      name: "Garlic Bread",
      slug: "garlic-bread",
      description: "Fresh baked bread with garlic butter",
      price: 6.99,
      categoryId: appetizers.id,
      featured: false,
    },

    // Burgers
    {
      name: "Classic Cheeseburger",
      slug: "classic-cheeseburger",
      description: "Beef patty with cheese, lettuce, tomato, and special sauce",
      price: 11.99,
      categoryId: burgers.id,
      featured: true,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    },
    {
      name: "Bacon BBQ Burger",
      slug: "bacon-bbq-burger",
      description: "Beef patty with crispy bacon, BBQ sauce, and onion rings",
      price: 13.99,
      categoryId: burgers.id,
      featured: true,
    },
    {
      name: "Veggie Burger",
      slug: "veggie-burger",
      description: "Plant-based patty with fresh vegetables",
      price: 10.99,
      categoryId: burgers.id,
      featured: false,
    },
    {
      name: "Chicken Burger",
      slug: "chicken-burger",
      description: "Grilled chicken breast with mayo and pickles",
      price: 12.99,
      categoryId: burgers.id,
      featured: false,
    },
    {
      name: "Mushroom Swiss Burger",
      slug: "mushroom-swiss-burger",
      description: "Beef patty with sautéed mushrooms and Swiss cheese",
      price: 13.99,
      categoryId: burgers.id,
      featured: false,
    },

    // Pizza
    {
      name: "Margherita Pizza",
      slug: "margherita-pizza",
      description: "Classic pizza with tomato, mozzarella, and basil",
      price: 14.99,
      categoryId: pizza.id,
      featured: true,
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
    },
    {
      name: "Pepperoni Pizza",
      slug: "pepperoni-pizza",
      description: "Classic pepperoni with mozzarella cheese",
      price: 16.99,
      categoryId: pizza.id,
      featured: true,
    },
    {
      name: "BBQ Chicken Pizza",
      slug: "bbq-chicken-pizza",
      description: "BBQ sauce, chicken, red onions, and cilantro",
      price: 17.99,
      categoryId: pizza.id,
      featured: false,
    },
    {
      name: "Vegetarian Pizza",
      slug: "vegetarian-pizza",
      description: "Loaded with fresh vegetables and cheese",
      price: 15.99,
      categoryId: pizza.id,
      featured: false,
    },
    {
      name: "Hawaiian Pizza",
      slug: "hawaiian-pizza",
      description: "Ham, pineapple, and mozzarella",
      price: 16.99,
      categoryId: pizza.id,
      featured: false,
    },

    // Pasta
    {
      name: "Spaghetti Carbonara",
      slug: "spaghetti-carbonara",
      description: "Creamy pasta with bacon, eggs, and parmesan",
      price: 15.99,
      categoryId: pasta.id,
      featured: true,
    },
    {
      name: "Fettuccine Alfredo",
      slug: "fettuccine-alfredo",
      description: "Rich and creamy Alfredo sauce with parmesan",
      price: 14.99,
      categoryId: pasta.id,
      featured: false,
    },
    {
      name: "Penne Arrabbiata",
      slug: "penne-arrabbiata",
      description: "Spicy tomato sauce with garlic and red peppers",
      price: 13.99,
      categoryId: pasta.id,
      featured: false,
    },
    {
      name: "Lasagna",
      slug: "lasagna",
      description: "Layered pasta with meat sauce and cheese",
      price: 16.99,
      categoryId: pasta.id,
      featured: false,
    },

    // Salads
    {
      name: "Caesar Salad",
      slug: "caesar-salad",
      description: "Romaine lettuce with Caesar dressing and croutons",
      price: 9.99,
      categoryId: salads.id,
      featured: false,
    },
    {
      name: "Garden Salad",
      slug: "garden-salad",
      description: "Mixed greens with vegetables and vinaigrette",
      price: 8.99,
      categoryId: salads.id,
      featured: false,
    },
    {
      name: "Greek Salad",
      slug: "greek-salad",
      description: "Fresh vegetables with feta cheese and olives",
      price: 10.99,
      categoryId: salads.id,
      featured: false,
    },

    // Desserts
    {
      name: "Chocolate Lava Cake",
      slug: "chocolate-lava-cake",
      description: "Warm chocolate cake with a molten center",
      price: 7.99,
      categoryId: desserts.id,
      featured: true,
    },
    {
      name: "Cheesecake",
      slug: "cheesecake",
      description: "Creamy New York style cheesecake",
      price: 6.99,
      categoryId: desserts.id,
      featured: false,
    },
    {
      name: "Ice Cream Sundae",
      slug: "ice-cream-sundae",
      description: "Vanilla ice cream with hot fudge and whipped cream",
      price: 5.99,
      categoryId: desserts.id,
      featured: false,
    },
    {
      name: "Tiramisu",
      slug: "tiramisu",
      description: "Classic Italian dessert with coffee and mascarpone",
      price: 7.99,
      categoryId: desserts.id,
      featured: false,
    },

    // Drinks
    {
      name: "Coca Cola",
      slug: "coca-cola",
      description: "Classic cola",
      price: 2.99,
      categoryId: drinks.id,
      featured: false,
    },
    {
      name: "Fresh Lemonade",
      slug: "fresh-lemonade",
      description: "Freshly squeezed lemonade",
      price: 3.99,
      categoryId: drinks.id,
      featured: false,
    },
    {
      name: "Iced Tea",
      slug: "iced-tea",
      description: "Refreshing iced tea",
      price: 2.99,
      categoryId: drinks.id,
      featured: false,
    },
    {
      name: "Orange Juice",
      slug: "orange-juice",
      description: "Fresh squeezed orange juice",
      price: 3.99,
      categoryId: drinks.id,
      featured: false,
    },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
  }

  console.log(`✅ Created ${menuItems.length} menu items`);
  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
