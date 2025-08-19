import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

function InfoCard({
    icon,
    label,
    value,
    color
}) {
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.5 }
        );
    }, []);

    return (
        <div ref={cardRef} className='flex gap-6 bg-white p-6 rounded-2xl shadow-md shadow-gray-200 border border-gray-100/10 card'> 
            <div className={`w-14 h-14 flex items-center justify-center rounded-full text-white text-[26px] ${color} drop-shadow-xl`}>
                {icon}
            </div>
            <div>
                <h6 className='text-sm text-gray-500 mb-1'>{label}</h6>
                <p className='text-[22px]'>{value} Frcfa</p>
            </div>
        </div>
    )
}

export default InfoCard
