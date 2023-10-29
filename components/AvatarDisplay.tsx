"use client"
import React, { useEffect } from 'react';
import styles from "../styles/Home.module.css";
import { Card, CardHeader, Image, CardBody, CardFooter, Divider, Tab, Tabs, Input, Tooltip, Progress, Button } from "@nextui-org/react";
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useContractReads, erc721ABI, Address, erc20ABI, useBlockNumber } from "wagmi";
import { avatarVaultABI } from '../abis/avatarVault-abi';
import verifiers from '@/helpers/verification';
import writePreperations from "../helpers/contractWritePrepares"
import readpreperations from '@/helpers/contractReaders';
import { EASCoinAddress } from "@/helpers/contractAddresses";



export default function AvatarDisplay(
    {
        userExpressionType,
        userExpressionVaultAddress,

    }: any) {

    useEffect(() => {
        if (userExpressionType != "None") {
            // avatarURIRead.refetch();
            avatarNameRead.refetch();
        }
    }, []);
    const [userAvatarURI, setUserAvatarURI] = React.useState("");
    const [userAvatarAdress, setUserAvatarAddress] = React.useState("0x${string}");
    const [userAvatarID, setUserAvatarID] = React.useState(BigInt(0));
    const [userAvatarName, setUserAvatarName] = React.useState("");


    const avatarAddressRead = readpreperations.generic.readAvatarAddress(userExpressionVaultAddress);
    useEffect(() => {
        if (typeof avatarAddressRead == "undefined") {
            setUserAvatarAddress("");
        } else {
            setUserAvatarAddress(avatarAddressRead);
        }
    }, [avatarAddressRead]);

    const avatarIDRead = readpreperations.generic.readAvatarID(userExpressionVaultAddress);
    useEffect(() => {
        if (typeof avatarIDRead == "undefined") {
            setUserAvatarID(BigInt(0));
        } else {
            setUserAvatarID(avatarIDRead);
        }
    }, [avatarIDRead]);

    const avatarURIRead = readpreperations.generic.readERC721TokenURI(userAvatarAdress, userAvatarID);
    useEffect(() => {
        if (typeof avatarURIRead.data == "undefined") {
            setUserAvatarURI("");
        } else {
            setUserAvatarURI(avatarURIRead.data);
        }
    }, [avatarURIRead]);

    const avatarNameRead = readpreperations.generic.readERC721Name(userAvatarAdress);
    useEffect(() => {
        if (typeof avatarNameRead.data == "undefined") {
            setUserAvatarName("");
        } else {
            setUserAvatarName(avatarNameRead.data);
        }
    }, [avatarNameRead]);

    return (
        <Card
            className={styles.avatarDisplay}
            isFooterBlurred
            radius="lg"
            showing-avatar={false}
        >
            {userExpressionType != "None" && (
                <Image
                    src={userAvatarURI}
                />

            )}
            {userExpressionType != "None" && (
                <CardFooter className={["before:bg-white/10 border-white/20 border-1 py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10", styles.avatarInformationBox].join(" ")} >
                    <p className={styles.avatarInformation}>{userAvatarName}</p>
                    <p className={styles.avatarInformation}>#{userAvatarID.toString()}</p>
                </CardFooter>
            )
            }

        </Card >
    );
}





