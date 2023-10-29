"use client"

import React, { useState, useEffect } from 'react';
import { NextPage } from "next";
import styles from '../../styles/Home.module.css';
import { useAccount, useContractWrite, useContractEvent, useWaitForTransaction, Address } from "wagmi";
import readpreperations from '@/helpers/contractReaders';
import FlipCard, { BackCard, FrontCard } from '../../components/FlipCard';
import question from "../../images/question.png";
import { Button, Image } from "@nextui-org/react";
import writePreperations from '@/helpers/contractWritePrepares';
import { EASNFT } from '@/helpers/contractAddresses';
import { EASNFTConfig } from "@/helpers/contractConfigurations";


const Nft: NextPage = () => {
    type mintEvent = {
        txHash: string,
        from: Address,
        to: Address,
        tokenId: bigint
    }

    const emptyMint: mintEvent = {
        txHash: "0x0000000000000000000000000000000000000000",
        from: "0x0000000000000000000000000000000000000000",
        to: "0x0000000000000000000000000000000000000000",
        tokenId: BigInt(0)
    }

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const { isConnected } = useAccount();
    const [userAvatarURI, setUserAvatarURI] = useState("");
    const [latestMint, setLatestMint] = useState<mintEvent>(emptyMint);

    const [mintEvents, setMintEvents] = useState<{
        txHash: string,
        from: Address,
        to: Address,
        tokenId: bigint
    }[]>([]);
    const [mintTx, setMintTx] = React.useState("");
    useEffect(() => {
        mintEvents.map((event) => {
            if (event.txHash == mintTx) {
                setLatestMint(event);
                avatarURIRead.refetch();
                mintNFTWrite.reset();
                setMintEvents([]);
            }
        })
    }, [mintTx, mintEvents]);

    let mintNFTPrep = writePreperations.generic.erc721Mint();
    const mintNFTWrite = useContractWrite(mintNFTPrep.config);
    useWaitForTransaction({
        hash: mintNFTWrite.data?.hash,
        onSuccess(data) {
            setMintTx(data.transactionHash);
        },
    });

    const avatarURIRead = readpreperations.generic.readERC721TokenURI(EASNFT, latestMint?.tokenId);
    useEffect(() => {
        if (typeof avatarURIRead.data == "undefined") {
            setUserAvatarURI("");
        } else {
            setUserAvatarURI(avatarURIRead.data);
        }
    }, [avatarURIRead]);

    const erc721Config = EASNFTConfig;
    useContractEvent({
        ...erc721Config,
        eventName: 'Transfer',
        listener(log) {
            const eventData = log[0];
            if (
                typeof eventData.args.from != "undefined" &&
                typeof eventData.args.to != "undefined" &&
                typeof eventData.args.tokenId != "undefined"
            ) {
                setMintEvents([
                    ...mintEvents,
                    {
                        txHash: log[0].transactionHash,
                        from: eventData.args.from,
                        to: eventData.args.to,
                        tokenId: eventData.args.tokenId
                    }
                ]);
            }
        },
    });

    function mintNFT() {
        setLatestMint(emptyMint);
        mintNFTWrite.write?.()
    }

    return (
        <div className={styles.container}>
            <p className={styles.title}>
                Mint a free NFT
            </p>
            {mounted && !isConnected && (
                <div>
                    <h2>Connect your wallet to get started</h2>
                </div>
            )}

            {mounted && isConnected && (
                <div className="flex flex-col items-center gap-y-5">
                    <p className={styles.description}>
                        Mint a cute cat to use in your avatar vault
                    </p>
                    <p>Contract Address: {EASNFT}</p>

                    <Button
                        color="primary"
                        className={[styles.button, "self-center"].join(" ")}
                        onClick={() => mintNFT()}
                        data-write-loading={mintNFTWrite.isLoading || mintNFTWrite.isSuccess}
                        isLoading={mintNFTWrite.isSuccess}
                        disabled={mintNFTWrite.isLoading}
                    >
                        {!mintNFTWrite.isLoading && !mintNFTWrite.isSuccess && "Mint"}
                        {mintNFTWrite.isLoading && "Waiting for approval"}
                        {mintNFTWrite.isSuccess && "Minting..."}
                    </Button>
                    <FlipCard className={styles.nftMintCard}>
                        <FrontCard isCardFlipped={latestMint?.to != "0x0000000000000000000000000000000000000000"}>
                            <Image className={styles.questionmark} src={question.src} alt="A question mark" />

                        </FrontCard>
                        <BackCard isCardFlipped={latestMint?.to != "0x0000000000000000000000000000000000000000"}>
                            <Image
                                src={userAvatarURI}
                            />
                        </BackCard>
                    </FlipCard>
                    <p>{latestMint?.to != "0x0000000000000000000000000000000000000000" ? "You are now the proud owner of this cat with ID " + Number(latestMint.tokenId) : ""}</p>

                </div>

            )
            }
        </div >
    );
};

export default Nft;