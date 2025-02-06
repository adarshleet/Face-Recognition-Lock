import React from 'react'
import FaceExpressionCanvas from '../components/FaceExpressionCanvas'
import { Link } from 'react-router-dom'

const Dashboard = () => {
    return (
        <div className='flex justify-center items-center pt-10 md:pt-32'>
            <div className='px-4 md:px-96 flex flex-col justify-center items-center'>
                <FaceExpressionCanvas/>
                <div className='text-center mb-6 mt-2'>
                    <h2 className='text-4xl md:text-6xl text-white font-bold'>🔒 Face Recognition Lock 🔒</h2>
                    <p className='text-amber-50 text-xl md:text-2xl'>Face Recognition Lock lets you register your face and unlock access with a quick scan. Just save your face once, and next time, scan to unlock your space—no passwords needed! 🔓🚀</p>
                </div>
                <div className='flex justify-center gap-x-3'>
                    <Link to={'/register'}>
                        <button className='text-white cursor-pointer text-xl bg-blue-500 py-1 px-2 rounded-md font-bold'>Register Face</button>
                    </Link>
                    <button className='text-white cursor-pointer text-xl bg-green-500 py-1 px-2 rounded-md font-bold'>Login With Face Unlock</button>
                </div>
                
            </div>
        </div>
    )
}

export default Dashboard
