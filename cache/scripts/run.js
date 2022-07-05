const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Charizard", "Infernape", "Zapdos"], // all the characters names are here
    [
      "https://i.imgur.com/ZyvkL4G.jpeg", // and their images are stored here
      "https://i.imgur.com/iqw8KBx.jpeg",
      "https://i.imgur.com/ROnLhNr.jpeg",
    ],
    [200, 300, 400], // the hit points values are stores in this argument
    [200, 100, 50],
    "Mewtwo", // boss name
    "https://media.comicbook.com/2019/11/pokemon-mewtwo-anime-1197317.jpeg?auto=webp&width=1200&height=626&crop=1200:626,smart", // boss image
    5000, // boss health points
    60 // boss attack damage // this stores the amount of damage it can do when it attack or AttackDamage
  );
  await gameContract.deployed();

  console.log("Contract deployed to:", gameContract.address);
  let txn;
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  txn = await gameContract.attackBoss();
  await txn.wait();

  console.log("Done");
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
