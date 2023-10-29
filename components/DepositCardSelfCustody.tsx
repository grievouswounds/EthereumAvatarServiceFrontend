"use client"
import React, { useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';
import { Card, CardHeader, CardBody, CardFooter, Divider, Tab, Tabs, Input, Tooltip, Progress } from "@nextui-org/react";
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useContractReads, erc721ABI, Address, erc20ABI, useBlockNumber } from "wagmi";
import { Button } from '@nextui-org/button';
import { avatarVaultABI } from "../abis/avatarVault-abi";
import verifiers from '@/helpers/verification';
import writePreperations from "../helpers/contractWritePrepares"
import readpreperations from '@/helpers/contractReaders';
import { EASCoinAddress } from "@/helpers/contractAddresses";

// interface DepositCardEscrowProps {
//     calculatedCustodyBlock: string
//     userExpressionType: string
//     nftAddressInputSelfCustodyUpdate,
//     nftIDInputSelfCustodyUpdate,
//     setInputEACDepositSelfCustody,
//     approveCoinsSelfCustodyWrite,
//     setAvatarSelfCustodyWrite,
//     inputNFTAddressSelfCustody,
//     inputNFTIDSelfCustody
// }
// any -> DepositCardEscrowProps


//TODO: change let -> const
export default function DepositCardSelfCustody(
    {
        userExpressionType,
        userExpressionVaultAddress
    }: any) {
    const { data: blockNumber, isError: isBlockNumberError, isLoading: isblockNumberLoading } = useBlockNumber();
    const [selfCustodyProgressSteps, setSelfCustodyProgressSteps] = React.useState(Array(5).fill(false));
    useEffect(() => {
        const progress = selfCustodyProgressSteps.filter((x) => x == true).length * 20;
        setSelfCustodyProgress(progress);
        console.log(progress);
    }, [selfCustodyProgressSteps]);
    const [selfCustodyProgress, setSelfCustodyProgress] = React.useState(0);
    const [inputERC721Address, setInputERC721Address] = React.useState("");//TODO: Add validation that it starts with 0x
    const [inputERC721ID, setInputERC721ID] = React.useState(""); //TODO: Add validation number is greater than 0
    const [inputEACDepositAmount, setInputEACDepositAmount] = React.useState(""); //TODO: start this at int 0 instead of string
    useEffect(() => {
        var adder = BigInt(0);

        if (inputEACDepositAmount !== "") {
            adder = BigInt(inputEACDepositAmount);
        }
        if (isblockNumberLoading || isBlockNumberError || blockNumber == undefined) {
            return;
        } else {
            if (inputEACDepositAmount != "") {
                const block = blockNumber + adder;
                setCalculatedCustodyBlock(block.toString());
            } else {
                setCalculatedCustodyBlock("")
            }
        }
    });

    useEffect(() => {
        if (selfCustodyProgress >= 60) {
            approveERC20Prep.refetch();
        }
        if (selfCustodyProgress >= 80) {
            setAvatarPrep.refetch();
        }
    }, [selfCustodyProgress]);
    const [calculatedCustodyBlock, setCalculatedCustodyBlock] = React.useState("");

    let approveERC20Prep = writePreperations.generic.erc20Approve(userExpressionVaultAddress, BigInt(inputEACDepositAmount), EASCoinAddress);
    const approveERC20Write = useContractWrite(approveERC20Prep.config);
    useWaitForTransaction({
        hash: approveERC20Write.data?.hash,
        onSuccess() {
            const newProgressSteps = [...selfCustodyProgressSteps];
            newProgressSteps[3] = true;
            setSelfCustodyProgressSteps(newProgressSteps);
        },
    });

    let setAvatarPrep = writePreperations.selfCustody.setAvatar(inputERC721Address, BigInt(inputERC721ID), userExpressionVaultAddress, BigInt(inputEACDepositAmount));
    const setAvatarWrite = useContractWrite(setAvatarPrep.config);
    useWaitForTransaction({
        hash: setAvatarWrite.data?.hash,
        onSuccess() {
            const newProgressSteps = [...selfCustodyProgressSteps];
            newProgressSteps[4] = true;
            setSelfCustodyProgressSteps(newProgressSteps);
            setTimeout(resetInputs, 2000)

        },
    });

    function nftAddressInputSelfCustodyUpdate(calldata: string) {
        const isAddress = verifiers.isValidEthereumAddress(calldata);
        setInputERC721Address(calldata);
        if (isAddress) {
            const newProgressSteps = [...selfCustodyProgressSteps];
            newProgressSteps[0] = true;
            setSelfCustodyProgressSteps(newProgressSteps);
        } else {
            const newProgressSteps = [...selfCustodyProgressSteps];
            newProgressSteps[0] = false;
            setSelfCustodyProgressSteps(newProgressSteps);
        }
    }

    function inputERC721IDUpdate(calldata: string) {
        if (verifiers.isNumbers(calldata)) {
            setInputERC721ID(calldata);
            const newProgressSteps = [...selfCustodyProgressSteps];
            newProgressSteps[1] = true;
            setSelfCustodyProgressSteps(newProgressSteps);
        } else {
            const newProgressSteps = [...selfCustodyProgressSteps];
            newProgressSteps[1] = false;
            setSelfCustodyProgressSteps(newProgressSteps);
        }
    }

    function inputEACDepositAmountUpdate(calldata: string) {
        if (verifiers.isNumbers(calldata)) {
            setInputEACDepositAmount(calldata);
            const newProgressSteps = [...selfCustodyProgressSteps];
            newProgressSteps[2] = true;
            setSelfCustodyProgressSteps(newProgressSteps);
        } else {
            const newProgressSteps = [...selfCustodyProgressSteps];
            newProgressSteps[2] = false;
            setSelfCustodyProgressSteps(newProgressSteps);
        }
    }

    function resetInputs() {
        setSelfCustodyProgressSteps(Array(5).fill(false));
        setSelfCustodyProgress(0);
        setInputERC721Address("");
        setInputERC721ID("");
        setInputEACDepositAmount("");
        approveERC20Write.reset();
        setAvatarWrite.reset();
    }

    function btnpress() {
        setAvatarWrite.write?.()
    }

    return (
        <Card isDisabled={userExpressionType != "None"}>
            <CardHeader>
                <h1>Set avatar with self custody</h1>
            </CardHeader>
            <Divider />
            <CardBody>
                <Input
                    isDisabled={userExpressionType != "None"}
                    className={styles.setAvatarInput}
                    type="text"
                    value={inputERC721Address}
                    label="NFT Contract Address"
                    placeholder="0x..."
                    onValueChange={(value: string) => nftAddressInputSelfCustodyUpdate(value)}
                />
                <Input
                    isDisabled={userExpressionType != "None"}
                    className={styles.setAvatarInput}
                    type="text"
                    label="NFT ID"
                    placeholder="0"
                    onValueChange={(value: string) => inputERC721IDUpdate(value)}
                />
                <Input
                    className={styles.setAvatarInput}
                    type="text"
                    label="EAC security deposit amount"
                    placeholder="0"
                    onValueChange={(value: string) => inputEACDepositAmountUpdate(value)}
                />
                <Button
                    className={[styles.button, styles.setAvatarButton].join(" ")}
                    color="primary"
                    onClick={() => approveERC20Write.write?.()}
                    data-write-loading={approveERC20Write.isLoading || approveERC20Write.isSuccess}
                    isLoading={approveERC20Write.isSuccess && selfCustodyProgress < 80}
                    isDisabled={selfCustodyProgress != 60}
                >
                    {!approveERC20Write.isLoading && !approveERC20Write.isSuccess && "Approve EAC Transfer"}
                    {approveERC20Write.isLoading && selfCustodyProgress < 80 && "Waiting for approval"}
                    {approveERC20Write.isSuccess && selfCustodyProgress < 80 && "Approving..."}
                    {selfCustodyProgress > 60 && "EAC Transfer Approved"}
                </Button>
                <Button
                    className={[styles.button, styles.setAvatarButton].join(" ")}
                    color="primary"
                    onClick={() => btnpress()}
                    data-write-loading={setAvatarWrite.isLoading || setAvatarWrite.isSuccess}
                    isLoading={setAvatarWrite.isSuccess && selfCustodyProgress < 100}
                    isDisabled={selfCustodyProgress != 80}
                >
                    {!setAvatarWrite.isLoading && !setAvatarWrite.isSuccess && "Set Avatar"}
                    {setAvatarWrite.isLoading && selfCustodyProgress < 100 && "Waiting for approval"}
                    {setAvatarWrite.isSuccess && selfCustodyProgress < 100 && "Setting Avatar..."}
                    {selfCustodyProgress > 80 && "Avatar Set"}
                </Button>

                <Progress aria-label="Escrow Loading..." value={selfCustodyProgress} className="max-w-md" />
            </CardBody>
            <Divider />
            <CardFooter>
                <Tooltip placement="left" showArrow={true} content="Until which block self custody will be active">
                    <p>Self Custody Block: {calculatedCustodyBlock}</p>
                </Tooltip>
            </CardFooter>
        </Card >
    );
}
