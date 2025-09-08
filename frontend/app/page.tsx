import Image from "next/image";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="grid grid-cols-[auto_1fr] gap-4 mx-auto w-full min-h-screen h-full p-4">
                <div className="w-[300px] h-full border p-4 flex flex-col items-center justify-start">
                    <h3 className="text-md font-semibold mt-4 mb-2">Classes</h3>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="border rounded p-3 shadow-sm">
                            <div className="font-semibold">
                                Calculus — Differential
                            </div>
                            <div className="text-sm text-gray-600">
                                09:00 - 10:00
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                Prof. Alice Morgan
                            </div>
                        </div>
                        <div className="border rounded p-3 shadow-sm">
                            <div className="font-semibold">
                                Computer Lab — Intro to CS
                            </div>
                            <div className="text-sm text-gray-600">
                                10:00 - 12:00
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                Dr. Brian Lee
                            </div>
                        </div>
                        <div className="border rounded p-3 shadow-sm">
                            <div className="font-semibold">
                                English Literature
                            </div>
                            <div className="text-sm text-gray-600">
                                13:00 - 14:00
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                Prof. Clara Ortiz
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-fit border p-4">
                    <h2 className="text-lg font-semibold mb-3 text-center">
                        Weekly Time Table
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-sm border-collapse">
                            <thead>
                                <tr className="">
                                    <th className="border px-2 py-1">Time</th>
                                    <th className="border px-2 py-1">Mon</th>
                                    <th className="border px-2 py-1">Tue</th>
                                    <th className="border px-2 py-1">Wed</th>
                                    <th className="border px-2 py-1">Thu</th>
                                    <th className="border px-2 py-1">Fri</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-2 py-1">
                                        09:00 - 10:00
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="border px-2 py-1">
                                        10:00 - 11:00
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border px-2 py-1">
                                        11:00 - 12:00
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="border px-2 py-1">
                                        12:00 - 13:00
                                    </td>
                                    <td className="border px-2 py-1"></td>
                                    <td className="border px-2 py-1"></td>
                                    <td className="border px-2 py-1"></td>
                                    <td className="border px-2 py-1"></td>
                                    <td className="border px-2 py-1"></td>
                                </tr>
                                <tr>
                                    <td className="border px-2 py-1">
                                        13:00 - 14:00
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="border px-2 py-1">
                                        14:00 - 15:00
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border px-2 py-1">
                                        15:00 - 16:00
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                </tr>
                                <tr className="">
                                    <td className="border px-2 py-1">
                                        16:00 - 17:00
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                    <td className="border px-2 py-1">
                                        
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
