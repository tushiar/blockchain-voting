import React, { useEffect, useState } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

function App() {
  const [storageValue, setStorageValue] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.

        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const contract = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        // console.log(connections);
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
        console.log(web3, accounts, contract);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const load = async () => {
      console.log("Load:" + contract.methods);
      await contract.methods.set(10).send({ from: accounts[0] });
      const response = await contract.methods.get().call();
      setStorageValue(response);
    };
    if (
      typeof web3 !== "undefined" &&
      typeof accounts !== "undefined" &&
      typeof contract !== "undefined"
    ) {
      load();
    }
  }, [web3, accounts, contract]);

  if (typeof web3 === "undefined") {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div className="App">
      <h1>Good to Go!</h1>
      <p>Your Truffle Box is installed and ready.</p>
      <h2>Smart Contract Example</h2>
      <p>
        If your contracts compiled and migrated successfully, below will show a
        stored value of 5 (by default).
      </p>
      <p>
        Try changing the value stored on <strong>line 40</strong> of App.js.
      </p>
      <div>The stored value is: {storageValue}</div>
    </div>
  );
}

export default App;
