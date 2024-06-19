import React from 'react';
import Image from 'next/image';
import Link from "next/link";

const Navbar= () => {
    return (
        <nav className="bg-[#D9A05B] p-4 flex justify-between items-center shadow-md shadow-black h-20">
            <div className="flex items-center ml-20">
                <Link href={"/"}>
                <Image src="/logo.png" alt="Logo" width={60} height={60} />
                </Link>
                <span className="text-xl font-bold text-gray-800"></span>
            </div>

            <div className="flex space-x-4">

            </div>
        </nav>
    );
};

export default Navbar;
