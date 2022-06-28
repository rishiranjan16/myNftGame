const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Charizard", "HoOh", "Aerodactyl"],
    [
      "https://www.giantbomb.com/a/uploads/scale_small/13/135472/1891763-006charizard.png",
      "http://drawcentral.com/wp-content/uploads/2018/12/How-To-Draw-Ho-Oh-Main-1170x789.jpg",
      "https://www.ginx.tv/respawn-cdn/u-BNEhJxouIt1BCUzDtWDrvX9Y7UAi5EHyKl_xQzBjI/fill/1200/0/no/1/aHR0cHM6Ly93d3cuZ2lueC50di91cGxvYWRzMi9Qb2vDqW1vbl9HTy9hZXJvZGFjdHlscG9rZW1vbmdvLmpwZw.webp",
    ],
    [(190, 200, 170)], // Hitpoints
    [(100, 250, 95)] // attack points
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
