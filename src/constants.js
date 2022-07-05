const CONTRACT_ADDRESS = "0x95eBBa0bdD5B28Ee3b1C91DA104B98eE54105bd3";



const transformCharacterData = (characterData) => {
  return { 
    name: characterData.name,
    imageURI : characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
    }
};
export {CONTRACT_ADDRESS, transformCharacterData};