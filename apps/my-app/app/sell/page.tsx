"use client";

import { useSession } from "next-auth/react";
import { SellItemForm } from "../components/pages/AddItem";
import { Modal } from 'react-responsive-modal';
import { useState, useEffect } from "react";
import { SignupPage } from "../components/pages/Signupage";

export default function Sell() {
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);

    const onCloseModal = () => setOpen(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            setOpen(true);
        }
    }, [status]);

    return (
        <div>
            {session ? (
                <SellItemForm />
            ) : (
                <Modal open={open} onClose={onCloseModal} center>
                    <SignupPage />
                </Modal>
            )}
        </div>
    );
}
