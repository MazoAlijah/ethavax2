import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [ownerError, setOwnerError] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const deposit10 = async () => {
    if (atm) {
      let tx = await atm.deposit(10);
      await tx.wait();
      getBalance();
    }
  }

    const deposit100 = async () => {
      if (atm) {
        let tx = await atm.deposit(100);
        await tx.wait();
        getBalance();
      }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw10 = async() => {
    if (atm) {
      let tx = await atm.withdraw(10);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw100 = async() => {
    if (atm) {
      let tx = await atm.withdraw(100);
      await tx.wait()
      getBalance();
    }
  }

  const multiplyValue = async () => {
    if (atm) {
      try {
        const tx = await atm.multiplyBalance(2); 
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error(error);
      }
    }
  }

  const multiplyValue5 = async () => {
    if (atm) {
      try {
        const tx = await atm.multiplyBalance(5); 
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error(error);
      }
    }
  }

  const multiplyValue10 = async () => {
    if (atm) {
      try {
        const tx = await atm.multiplyBalance(10);
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error(error);
      }
    }
  }
  const multiplyValue100 = async () => {
    if (atm) {
      try {
        const tx = await atm.multiplyBalance(100); 
        await tx.wait();
        getBalance();
      } catch (error) {
        console.error(error);
      }
    }
  }

  const transferOwnership = async (newOwner) => {
    if (atm && newOwner) {
      try {
        let tx = await atm.transferOwnership(newOwner);
        await tx.wait();
        alert(`Ownership transferred to ${newOwner}`);
      } catch (error) {
        setOwnerError(true);
        setTimeout(() => {
          setOwnerError(false);
        }, 5000);
      }
    }
  };

  
  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>

        <label>Deposit : &nbsp;&nbsp;&nbsp;</label>

        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={deposit10}>Deposit 10 ETH</button>
        <button onClick={deposit100}>Deposit 100 ETH</button>

        <label>Withdraw : </label>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <button onClick={withdraw10}>Withdraw 10 ETH</button>
        <button onClick={withdraw100}>Withdraw 100 ETH</button>

        <label>Multiply : </label>
        <button onClick={multiplyValue}> 2x</button>
        <button onClick={multiplyValue5}> 5x</button>
        <button onClick={multiplyValue10}> 10x</button>
        <button onClick={multiplyValue100}> 100x</button><br/><br/>

        <button
          onClick={() => {
            const newOwner = prompt("Enter the new owner address:");
            transferOwnership(newOwner);
          }}
        >
          Change Owner
        </button>
        {ownerError && <p className="error">Error: Unable to change the Owner</p>}
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Ethan's ATM!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: white;
          color: #5a1980;
          font-family: "Lucida Console", monospace;
          border-color: #87679c;
          border-style: solid;
          border-width: 8px;
        }
      `}
      </style>
    </main>
  )
}
