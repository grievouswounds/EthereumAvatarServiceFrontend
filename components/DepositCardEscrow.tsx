"use client"
import React, { useEffect, useRef } from 'react';
import styles from "../styles/Home.module.css";
import { Card, CardHeader, CardBody, CardFooter, Divider, Tab, Tabs, Input, Tooltip, Progress, Button } from "@nextui-org/react";
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useContractReads, erc721ABI, Address, erc20ABI, useBlockNumber } from "wagmi";
import { avatarVaultABI } from '../abis/avatarVault-abi';
import verifiers from '@/helpers/verification';
import writePreperations from "../helpers/contractWritePrepares"
import readpreperations from '@/helpers/contractReaders';
import { EASCoinAddress } from "@/helpers/contractAddresses";


export default function DepositCardEscrow(
    {
        userExpressionType,
        userExpressionVaultAddress,

    }: any) {
    const [userEscrowCost, setUserEscrowCost] = React.useState(BigInt(-1));
    const [escrowProgessSteps, setEscrowProgessSteps] = React.useState(Array(5).fill(false)); //TODO: Check if setting directly with [] is ok, or should use setter
    useEffect(() => {
        const progress = escrowProgessSteps.filter((x) => x == true).length * 20;
        setEscrowProgress(progress);
    }, [escrowProgessSteps]);
    const [escrowProgess, setEscrowProgress] = React.useState(0);
    const [inputERC721Address, setInputERC721Address] = React.useState("");
    const [inputERC721ID, setInputERC721ID] = React.useState(""); //TODO: Add validation number is greater than 0

    useEffect(() => {
        if (escrowProgess >= 40) {
            approveERC721Prep.refetch();
        }
        if (escrowProgess >= 60) {
            approveERC20Prep.refetch();
        }
        if (escrowProgess >= 80) {
            setAvatarPrep.refetch();
        }
    }, [escrowProgess]);

    const escrowCost = readpreperations.escrow.readEscrowCost(userExpressionVaultAddress);
    useEffect(() => {
        if (typeof escrowCost != "undefined") {
            setUserEscrowCost(escrowCost);

        } else {
            setUserEscrowCost(BigInt(-1))
        }
    }, [escrowCost]);

    let approveERC721Prep = writePreperations.generic.erc721Approve(userExpressionVaultAddress, BigInt(inputERC721ID), inputERC721Address)
    const approveERC721Write = useContractWrite(approveERC721Prep.config);
    useWaitForTransaction({
        hash: approveERC721Write.data?.hash,
        onSuccess() {
            const newProgressSteps = [...escrowProgessSteps];
            newProgressSteps[2] = true;
            setEscrowProgessSteps(newProgressSteps);
        },
    })

    let approveERC20Prep = writePreperations.generic.erc20Approve(userExpressionVaultAddress, BigInt(10), EASCoinAddress);
    const approveERC20Write = useContractWrite(approveERC20Prep.config);
    useWaitForTransaction({
        hash: approveERC20Write.data?.hash,
        onSuccess() {
            const newProgressSteps = [...escrowProgessSteps];
            newProgressSteps[3] = true;
            setEscrowProgessSteps(newProgressSteps);
        },
    })

    let setAvatarPrep = writePreperations.escrow.setAvatar(inputERC721Address, BigInt(inputERC721ID), userExpressionVaultAddress);
    const setAvatarWrite = useContractWrite(setAvatarPrep.config);
    useWaitForTransaction({
        hash: setAvatarWrite.data?.hash,
        onSuccess() {
            const newProgressSteps = [...escrowProgessSteps];
            newProgressSteps[4] = true;
            setEscrowProgessSteps(newProgressSteps);
            setTimeout(resetInputs, 2000)
        },
    });

    function resetInputs() {
        setEscrowProgessSteps(Array(5).fill(false));
        setEscrowProgress(0);
        setInputERC721Address("");
        setInputERC721ID("");
        approveERC721Write.reset();
        approveERC20Write.reset();
        setAvatarWrite.reset();
    }



    //TODO: Only allow valid characters to be type
    function inputERC721AddressUpdate(calldata: string) {
        const isAddress = verifiers.isValidEthereumAddress(calldata);
        setInputERC721Address(calldata);
        if (isAddress) {
            const newProgressSteps = [...escrowProgessSteps];
            newProgressSteps[0] = true;
            setEscrowProgessSteps(newProgressSteps);
        } else {
            const newProgressSteps = [...escrowProgessSteps];
            newProgressSteps[0] = false;
            setEscrowProgessSteps(newProgressSteps);
        }
    }

    function inputERC721IDUpdate(calldata: string) {
        if (verifiers.isNumbers(calldata)) {
            setInputERC721ID(calldata);
            const newProgressSteps = [...escrowProgessSteps];
            newProgressSteps[1] = true;
            setEscrowProgessSteps(newProgressSteps);
        } else {
            const newProgressSteps = [...escrowProgessSteps];
            newProgressSteps[1] = false;
            setEscrowProgessSteps(newProgressSteps);
        }
    }

    return (
        <Card isDisabled={userExpressionType != "None"}>
            <CardHeader className={styles.avatarVaultManageHeader}>
                <p>Set avatar with escrow</p>
            </CardHeader>
            <Divider />
            <CardBody >
                <Input
                    isDisabled={userExpressionType != "None"}
                    className={styles.setAvatarInput}
                    type="text"
                    value={inputERC721Address}
                    label="NFT Contract Address"
                    placeholder="0x..."
                    onValueChange={(value: string) => inputERC721AddressUpdate(value)}
                />
                <Input
                    isDisabled={userExpressionType != "None"}
                    className={styles.setAvatarInput}
                    type="text"
                    label="NFT ID"
                    placeholder="0"
                    onValueChange={(value: string) => inputERC721IDUpdate(value)}
                />
                <Button
                    className={[styles.button, styles.setAvatarButton].join(" ")}
                    color="primary"
                    onClick={() => approveERC721Write.write?.()}
                    data-write-loading={approveERC721Write.isLoading || approveERC721Write.isSuccess}
                    isLoading={approveERC721Write.isSuccess && escrowProgess < 60}
                    isDisabled={escrowProgess != 40}
                >
                    {!approveERC721Write.isLoading && !approveERC721Write.isSuccess && "Approve NFT Transfer"}
                    {approveERC721Write.isLoading && escrowProgess < 60 && "Waiting for approval"}
                    {approveERC721Write.isSuccess && escrowProgess < 60 && "Approving..."}
                    {escrowProgess > 40 && "NFT Approved"}
                </Button>
                <Button
                    className={[styles.button, styles.setAvatarButton].join(" ")}
                    color="primary"
                    onClick={() => approveERC20Write.write?.()}
                    data-write-loading={approveERC20Write.isLoading || approveERC20Write.isSuccess}
                    isLoading={approveERC20Write.isSuccess && escrowProgess < 80}
                    isDisabled={escrowProgess != 60}
                >
                    {!approveERC20Write.isLoading && !approveERC20Write.isSuccess && "Approve EAC Transfer"}
                    {approveERC20Write.isLoading && escrowProgess < 80 && "Waiting for approval"}
                    {approveERC20Write.isSuccess && escrowProgess < 80 && "Approving..."}
                    {escrowProgess > 60 && "EAC Approved"}
                </Button>
                <Button
                    className={[styles.button, styles.setAvatarButton].join(" ")}
                    color="primary"
                    onClick={() => setAvatarWrite.write?.()}
                    data-write-loading={setAvatarWrite.isLoading || setAvatarWrite.isSuccess}
                    isLoading={setAvatarWrite.isSuccess && escrowProgess < 100}
                    isDisabled={escrowProgess != 80}
                >
                    {!setAvatarWrite.isLoading && !setAvatarWrite.isSuccess && "Set Avatar"}
                    {setAvatarWrite.isLoading && escrowProgess < 100 && "Waiting for approval"}
                    {setAvatarWrite.isSuccess && escrowProgess < 100 && "Setting..."}
                    {escrowProgess > 80 && "Avatar Set"}
                </Button>

                <Progress aria-label="Escrow Loading..." value={escrowProgess} className="max-w-md" />
            </CardBody>
            <Divider />
            <CardFooter>
                <p>Escrow cost: {userEscrowCost.toString()} EAC</p>
            </CardFooter>
        </Card>
    );
}
