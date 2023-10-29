"use client"
import React, { useEffect } from 'react';
import styles from "../styles/Home.module.css";
import { Card, CardHeader, CardBody, CardFooter, Divider, Tab, Tabs, Input, Tooltip, Progress, Button } from "@nextui-org/react";
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useContractReads, erc721ABI, Address, erc20ABI, useBlockNumber } from "wagmi";
import { avatarVaultABI } from '../abis/avatarVault-abi';
import EscrowVault from "../components/EscrowVault";
import SelfCustodyVault from './SelfCustodyVault';
import readpreperations from '@/helpers/contractReaders';
import { EASCoinAddress } from "@/helpers/contractAddresses";



const vaultContractConfig = {
    address: "0x75537828f2ce51be7289709686A69CbFDbB714F1",
    abi: avatarVaultABI,
} as const;

export default function AvatarVaults(
    {
        userExpressionVaultAddress,
        userExpressionType,
        userVaultIsActive,
    }: any) {
    const [userAvatarAdress, SetUserAvatarAdress] = React.useState("");
    const [userAvatarVaultBalance, setUserAvatarVaultBalance] = React.useState(BigInt(-1));
    const [userIsLiquidated, setUserIsLiquidated] = React.useState(false);
    const [userSelfCustodyUntil, setUserSelfCustodyUntil] = React.useState(BigInt(0));

    const selfCustodyUntilRead = readpreperations.selfCustody.readBlockDeadline(userExpressionVaultAddress);
    useEffect(() => {
        if (typeof selfCustodyUntilRead == "undefined") {
            setUserSelfCustodyUntil(BigInt(0));
        } else {
            setUserSelfCustodyUntil(BigInt(selfCustodyUntilRead));
        }
    }, [selfCustodyUntilRead])

    const vaultIsLiquidatedRead = readpreperations.generic.readLiquidated(userExpressionVaultAddress);
    useEffect(() => {
        if (typeof vaultIsLiquidatedRead == "undefined") {
            setUserIsLiquidated(false);
        } else {
            setUserIsLiquidated(vaultIsLiquidatedRead)
        }
    }, [vaultIsLiquidatedRead])

    const avatarAddressRead = readpreperations.generic.readAvatarAddress(userExpressionVaultAddress);
    useEffect(() => {
        if (typeof avatarAddressRead == "undefined") {
            SetUserAvatarAdress("");
        } else {
            SetUserAvatarAdress(avatarAddressRead);
        }
    }, [avatarAddressRead]);

    const vaultBalanceOfRead = readpreperations.generic.readERC20BalanceOf(EASCoinAddress, userExpressionVaultAddress)
    useEffect(() => {
        if (typeof vaultBalanceOfRead == "undefined") {
            setUserAvatarVaultBalance(BigInt(-1));
        } else {
            setUserAvatarVaultBalance(BigInt(vaultBalanceOfRead));
        }
    }, [vaultBalanceOfRead])

    return (
        <Card className={styles.vaultDisplayCard}>
            <CardHeader className={styles.avatarVaultDisplayHeader} >
                <p className="uppercase font-bold">Your avatar vault</p>
            </CardHeader>
            <Divider />
            <CardBody>
                <div>
                    <div className="flex flex-row gap-x-1">
                        <Tooltip placement="left" showArrow={true} content="Whether your vault is currently displaying your avatar">
                            <p>Status:</p>
                        </Tooltip>
                        {userVaultIsActive ? "Active" : "Inactive"}
                    </div>
                    <div className="flex flex-row gap-x-1">
                        <Tooltip placement="left" showArrow={true} content="How your avatar is stored">
                            <p>Escrow type:</p>
                        </Tooltip>
                        {userExpressionType}
                    </div>


                    {userExpressionType != "None" && (
                        <div>
                            <div className="flex flex-row gap-x-1">
                                <Tooltip placement="left" showArrow={true} content="The EAC balance of your avatar vault.">
                                    <p>Coins in vault:</p>
                                </Tooltip>
                                {userAvatarVaultBalance.toString()}
                            </div>
                            <div className="flex flex-row gap-x-1">
                                <Tooltip placement="left" showArrow={true} content="Wheter your vault is currently liquidated.">
                                    <p>Liquidated:</p>
                                </Tooltip>
                                {userIsLiquidated ? "Yes" : "No"}
                            </div>

                            {userExpressionType == "Self Custody" && (
                                <div className="flex flex-row gap-x-1">
                                    <Tooltip placement="left" showArrow={true} content="How long self custody is valid for.">
                                        <p>Liquidation block:</p>
                                    </Tooltip>
                                    {userSelfCustodyUntil.toString()}
                                </div>
                            )}

                            <div className="flex flex-row gap-x-1">
                                <Tooltip placement="left" showArrow={true} content="The contract address of the currently stored ERC721.">
                                    <p>Avatar Address:</p>
                                </Tooltip>
                                {userAvatarAdress}
                            </div>
                            <div className="flex flex-row gap-x-1">
                                <Tooltip placement="left" showArrow={true} content="The contract address of your vault.">
                                    <p>Vault Address:</p>
                                </Tooltip>
                                {userExpressionVaultAddress}
                            </div>

                        </div>
                    )}

                </div>
            </CardBody>
            {userExpressionType == "Escrow" && (
                <EscrowVault
                    userExpressionVaultAddress={userExpressionVaultAddress}
                    userExpressionType={userExpressionType}
                />
            )}
            {userExpressionType == "Self Custody" && (
                <SelfCustodyVault
                    userExpressionVaultAddress={userExpressionVaultAddress}
                    userExpressionType={userExpressionType}
                />
            )}
        </Card>

    );
}
