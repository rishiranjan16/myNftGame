import React, { useEffect, useState } from "react";
import "./SelectCharacter.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../utils/MyEpicGame.json";
import LoadingIndicator from "../../Components/LoadingIndicator";

const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);
  const [mintingCharacter, setMintingCharacter] = useState(false);

  // UseEffect
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicGame.abi, signer);

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("Getting contract characters to mint");

        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log("charactersTxn:", charactersTxn);

        const characters = charactersTxn.map((characterData) => transformCharacterData(characterData));

        setCharacters(characters);
      } catch (error) {
        console.error("Something went wrong fetching characters:", error);
      }
    };

    // use of event from smart contract
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(`CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`);

     // getting metadata for our nft 
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("CharacterNFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
        alert(`Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${gameContract}/${tokenId.toNumber()}`);
      }
    };

    if (gameContract) {
      getCharacters();

      /*
       * Setup NFT Minted Listener
       */
      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      /*
       * When your component unmounts, let;s make sure to clean up this listener
       */
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  }, [gameContract]);

  // Actions
  const mintCharacterNFTAction = (characterId) => async () => {
    try {
      if (gameContract) {
       
        setMintingCharacter(true);
        console.log("Getting your pokemon...");
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log(mintTxn);
    //disappearing loading because minting is done
        setMintingCharacter(false);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
      
       // doesn't show loading indicator in case of any error 
      setMintingCharacter(false);
    }
  };

  // Render Methods
  const renderCharacters = () => {
    return characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img src={character.imageURI} alt={character.name} />
        <button type="button" className="character-mint-button" onClick={mintCharacterNFTAction(index)}>{`Mint ${character.name}`}</button>
      </div>
    ));
  };

  return (
    <div className="select-character-container">
      <h2>Choose your pokemon wisely.</h2>
      {/* Only show this when there are characters in state */}
      {characters.length > 0 && <div className="character-grid">{renderCharacters()}</div>}

      {mintingCharacter && (
        <div className="loading">
          <div className="indicator">
            <LoadingIndicator />
            <p>Catching your pokemon...</p>
          </div>
          <img
            src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
            alt="Minting loading indicator"
          />
        </div>
      )}
    </div>
  );
};

export default SelectCharacter;