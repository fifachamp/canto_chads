import {useEffect, useState} from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { ethers } from 'ethers'
import ChadsJson from '../../artifacts/contracts/CantoChads.sol/CantoChads.json'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNetwork } from 'wagmi'

const CONTRACT_ADDRESS = "0xB21A279a298E9348A1aDaF87B4C1015Bd2FFB5aE"
const TARGET_CHAIN = process.env.TARGET_CHAIN

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  const [contract, setContract] = useState(false)
  const [amountToMint, setAmountToMint] = useState(1)
  const [maxChads, setMaxChads] = useState(2222)
  const [totalSupply, setTotalSupply] = useState(0)
  const [priceFormatted, setPriceFormatted] = useState(111)
  const {chain} = useNetwork()

  useEffect(() => {
    attemptContractConnect()
  }, [chain])

  const attemptContractConnect = async () => {
    if (!window.ethereum) return
    console.log('CHAIN AND TARGET CHAIN: ',chain, TARGET_CHAIN)
    if (chain && `${chain.id}` !== `${TARGET_CHAIN}`) {
      handleError('Wrong chain. Connect to canto.')
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const chadContract = await new ethers.Contract(CONTRACT_ADDRESS, ChadsJson.abi, provider)
    setContract(chadContract)

    const totalSupply = (await chadContract.totalSupply()).toNumber()
    setTotalSupply(totalSupply)
    
    const maxChads = await chadContract._maxChads()
    setMaxChads(maxChads)

    const priceObj = await chadContract.chadPrice()
    const formatted = (await priceObj.toString()) / 10**18
    setPriceFormatted(formatted)
  }

  const handleSuccess = (message) => {
    toast.success(message, {
      theme: 'colored',
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const handleError = message => {
    toast.error(message, {
      theme: 'colored',
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    }); 
  }

  const handleMint = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const chadContract = await new ethers.Contract(CONTRACT_ADDRESS, ChadsJson.abi, signer)
      const chadPrice = await chadContract.chadPrice();
      const price = chadPrice.mul(amountToMint).toString()
      const res = await chadContract.mintChad(amountToMint, {value: price})
      handleSuccess('Minting...')
      await res.wait()
      handleSuccess('You minted!')
      const totalSupply = (await contract.totalSupply()).toNumber()
      setTotalSupply(totalSupply)
    } catch (e) {
      let errStr =  e.reason || e.data?.message || e.error?.message || e.message || e.code || 'Error minting: please try again'
      console.log(errStr)
      handleError(errStr)
    }
  }


  const reduceCount = () => {
    const newCount = amountToMint === 1 ? 1 : amountToMint - 1
    setAmountToMint(newCount)
  }

  const incrementCount = () => {
    const newCount = amountToMint === 10 ? 10 : amountToMint + 1
    setAmountToMint(newCount)
  }

  const buttonCopy = amountToMint > 1 ? "CHADS" : "CHAD"
  return (
    <div className={styles.container}>
      <Head>
        <title>CANTO CHADS</title>
        <meta name="description" content="2222 Chads minting on Canto" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
      </Head>
      {/* <audio loop autoPlay className={styles.audio}>
        <source src="theme.mp3" type="audio/mpeg"/>
      </audio>*/}
      <ToastContainer />
      <main className={`${styles.main} mt-12 lg:mt-20`}>
        <div className="flex flex-col lg:flex-row px-8 lg:px-20">
          <div className="text-white lg:mr-12 text-center lg:text-left mb-24">
            <h1 className="text-4xl lg:text-7xl rounded wrap mb-6 lg:mb-4">CANTOCHADS</h1>
            <div className="block lg:hidden">
              <img className="mx-auto" src="https://media.giphy.com/media/dNA8Vxo7llT8CKZFIg/giphy.gif"/>
            </div>
            <h1 className="text-xl lg:text-2xl rounded wrap mb-4 w-full lg:max-w-xl mt-6 lg:mt-0">A very limited supply of {maxChads} unique elite alpha CHADS on the Canto blockchain for {priceFormatted} CANTO each.</h1>
            <div className="flex content-center mt-8">
              <div className="flex flex-col items-center mx-auto lg:mt-12">
                <div className="text-2xl lg:text-3xl mt-auto mb-2">
                  <h1>{totalSupply}/{maxChads}</h1>
                </div>
                <div className="flex items-center mb-2">
                  <img src="arrow-left.png" className="w-16 lg:w-28" onClick={reduceCount}/>
                  <h1 className="text-3xl">{amountToMint}</h1>
                  <img src="arrow-right.png" className="w-16 lg:w-28" onClick={incrementCount}/>
                </div>
                <button onClick={handleMint} className="bg-canto mt-2 text-black px-5 py-2 w-48">
                  MINT {amountToMint} <span className="capitalize">{buttonCopy}</span>
                </button>
                <h1 className="text-white text-xs text-left mt-2">MAX 10 PER WALLET</h1>
              </div>
            </div>
            <div className="w-full flex">
              
            </div>
          </div>
          <div className="hidden lg:block">
            <img src="https://media.giphy.com/media/dNA8Vxo7llT8CKZFIg/giphy.gif"/>
          </div>
        </div>


        <div className="fixed top-0 left-0 pl-2 pb-2 w-full flex">
            <div className="ml-2 mt-2">
              <ConnectButton 
                showBalance={false}
                accountStatus="address"
                label="Connect"
                chainStatus="none"
                className="text-canto"
                />
            </div>
            <div className="ml-auto flex pr-4 pt-4">
              <a href="https://twitter.com/cantochads">
                <img src="twitter.png" className="w-4 h-4 mr-4 cursor-pointer"/>
              </a>
              <a href={`https://evm.explorer.canto.io/address/${CONTRACT_ADDRESS}`}>
                <img src="etherscan.png" className="w-4 h-4 cursor-pointer"/>
              </a>
            </div>
        </div>
      </main>
    </div>
  )
}