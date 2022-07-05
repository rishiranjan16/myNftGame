import React , {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import SelectCharacter from "./Components/SelectCharacter";
import './App.css';
import myEpicGame from './utils/MyEpicGame.json';
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS, transformCharacterData} from './constants';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';

// Constants
const TWITTER_HANDLE = 'rishiweb3';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [currentAccount , setCurrentAccount] = useState(null);
  const [characterNFT , setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameContract, setGameContract] = useState(null);
  

  
  const checkIfWalletIsConnected = async () => {
try { 
    const {ethereum} = window;
    if (!ethereum) {
      console.log('Make sure you have Metamask Installed')
      setIsLoading(false);
      return;
    } else {
      console.log('We have the ethereum object', ethereum)

      const accounts = await ethereum.request({method: 'eth_accounts'});
      if  (accounts.length != 0) {
        const account = accounts[0];
        console.log('Found an authorized account which is', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized account found')
      }
    }
  }
  catch (error){
    console.log(error);
  }

    setIsLoading(false);
  };

  const renderContent = () => {
    if(isLoading) {
      return <LoadingIndicator />;
    }
    // user has not connected to the wallet 
    if(!currentAccount) {
      return (
        <div className = "connect-wallet-container">
          <img 
            src = "https://24.media.tumblr.com/tumblr_m4sgtvryvl1qg52ruo1_500.gif"
          alt = "Mewtwo Gif"
          />
          <button 
            className = "cta-button connect-wallet-button"
          onClick ={connectWalletAction} > Connect Wallet 
        </button>
        </div>
      );
      
    }else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />
    }else if (currentAccount && characterNFT) {
      return(  <Arena characterNFT = {characterNFT} setCharacterNFT={setCharacterNFT}/>
);
             }
  };

  const connectWalletAction = async () => {
    try {
      const {ethereum} = window 
      if(!ethereum) {
        alert('Get Metamask')
         return;
       
        
      }
      const accounts = await ethereum.request({method: 'eth_requestAccounts', });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const checkNetwork = async () => {
  try { 
    if (window.ethereum.networkVersion !== '4') {
      alert("Please connect to Rinkeby!")
    }
  } catch(error) {
    console.log(error)
  }
}
  

  useEffect (() =>{
    setIsLoading(true);
    checkNetwork();
    checkIfWalletIsConnected();
  },[])
  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log('Checking for Character NFT on address', currentAccount);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract (
        CONTRACT_ADDRESS, 
        myEpicGame.abi,
        signer
      );
      const characterNFT = await gameContract.checkIfUserHasNFT();
      if(characterNFT.name) {
        console.log('User has character NFT');
        setCharacterNFT(transformCharacterData(characterNFT));
      } else {
        setIsLoading(false);
        console.log("NO character NFT found")
      }
    }
    if(currentAccount) {
      console.log('Current Account:', currentAccount);
      fetchNFTMetadata();
    } 
  }, [currentAccount]);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⭕Pokemon Go⭕</p>
          <p className="sub-text">Defend the world against Mewtwo</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} 
            />
          
        
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
