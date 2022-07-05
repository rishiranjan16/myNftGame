import React, { useEffect, useState } from "react";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import SelectCharacter from "./Components/SelectCharacter";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constants";
import myEpicGame from "./utils/MyEpicGame.json";
import { ethers } from "ethers";
import Arena from "./Components/Arena";
import LoadingIndicator from "./Components/LoadingIndicator";

// Constants
const TWITTER_HANDLE = "rishiweb3";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
    // State
    const [currentAccount, setCurrentAccount] = useState(null);
    const [characterNFT, setCharacterNFT] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        checkIfWalletIsConnected();
    }, []);

    useEffect(() => {
        const fetchNFTMetadata = async () => {
            console.log("Checking for Character NFT on address:", currentAccount);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicGame.abi, signer);

            const characterNFT = await gameContract.checkIfUserHasNFT();
            if (characterNFT.name) {
                console.log("User has character NFT");
                setCharacterNFT(transformCharacterData(characterNFT));
            }

            setIsLoading(false);
        };

        if (currentAccount) {
            console.log("CurrentAccount:", currentAccount);
            fetchNFTMetadata();
        }
    }, [currentAccount]);

   
    const renderContent = () => {
      
        if (isLoading) {
            return <LoadingIndicator />;
        }

        if (!currentAccount) {
            return (
                <div className="connect-wallet-container">
                    <img
                        src="https://24.media.tumblr.com/tumblr_m4sgtvryvl1qg52ruo1_500.gif"
                        alt="Pokemon Gif"
                    />
                
                    <button className="cta-button connect-wallet-button" onClick={connectWalletAction}>
                        {currentAccount
                            ? `Wallet ${currentAccount.substring(0, 6)}...${currentAccount.substring(
                                  currentAccount.length - 4
                              )} is connected`
                            : "Connect Wallet"}
                    </button>
                </div>
            );
         
        } else if (currentAccount && !characterNFT) {
            return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
        } else if (currentAccount && characterNFT) {
            return <Arena characterNFT={characterNFT} />;
        }
    };

    
    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log("Make sure you have MetaMask!");
                setIsLoading(false);
                return;
            } else {
                console.log("We have the ethereum object", ethereum);

                const accounts = await ethereum.request({ method: "eth_accounts" });

                if (accounts.length !== 0) {
                    const account = accounts[0];
                    console.log("Found an authorized account:", account);
                    setCurrentAccount(account);
                } else {
                    console.log("No authorized account found");
                }
            }
        } catch (error) {
            console.log(error);
        }

        setIsLoading(false);
    };

//connecting wallet
    const connectWalletAction = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

        //requesting access to accounts
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

         
            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">⭕Pokemon Go⭕</p>
                    <p className="sub-text">Defend the world against Mewtwo</p>
                
                    {renderContent()}
                </div>
                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
                    <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`made by  @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default App;
