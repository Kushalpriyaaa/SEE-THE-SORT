import React, { useState, useEffect } from 'react';
import { getMergeSortAnimations } from '../sortingAlgorithms/mergesorting.js';
import { getQuickSortAnimations } from '../sortingAlgorithms/quicksorting.js';
import { getBubbleSortAnimations } from '../sortingAlgorithms/bubblesorting.js';
import { getInsertionSortAnimations } from '../sortingAlgorithms/insertionsort.js';
import ExplanationTree from './ExplanationTree';
import './Sortingvisualizer.css';

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getBarColor(value, maxValue) {
    const ratio = value / maxValue;
    const hue = (120 - ratio * 120).toString(10);
    return `hsl(${hue}, 100%, 50%)`;
}

const ANIMATION_SPEED_MS = 70;

const SortingVisualizer = () => {
    const [array, setArray] = useState([]);
    const [maxValue, setMaxValue] = useState(0);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
    const [showExplanation, setShowExplanation] = useState(false);
    const [sorting, setSorting] = useState(false);
    const [numberOfBars, setNumberOfBars] = useState(30);  // Dynamic number of bars

    useEffect(() => {
        const handleResize = () => {
            // Adjust number of bars based on screen width
            if (window.innerWidth <= 768) {  // Mobile screen size
                setNumberOfBars(15); // Fewer bars for mobile
            } else {
                setNumberOfBars(30); // Default number for larger screens
            }
        };

        handleResize();  // Set initial number of bars
        window.addEventListener('resize', handleResize);  // Update on window resize

        return () => {
            window.removeEventListener('resize', handleResize);  // Cleanup on unmount
        };
    }, []);

    useEffect(() => {
        resetArray();
    }, [numberOfBars]);

    const resetArray = () => {
        const newArray = [];
        let currentMax = 0;
        for (let i = 0; i < numberOfBars; i++) {
            const randomNumber = randomIntFromInterval(5, 730);
            newArray.push(randomNumber);
            if (randomNumber > currentMax) currentMax = randomNumber;
        }
        setArray([...newArray]);
        setMaxValue(currentMax);
        setShowExplanation(false);
        setSorting(false);
        setSelectedAlgorithm('');
    };

    const handleSort = (sortFunction, algorithmName) => {
        setSorting(true);
        setShowExplanation(false);
        const animations = sortFunction(array);
        animateSort(animations, algorithmName);
    };

    const animateSort = (animations, algorithmName) => {
        const arrayBars = document.getElementsByClassName('array-bar');
        const newArray = [...array];
        
        animations.forEach((animation, i) => {
            setTimeout(() => {
                if (animation.type === 'color') {
                    const [barOneIdx, barTwoIdx, color] = animation.values;
                    arrayBars[barOneIdx].style.backgroundColor = color;
                    arrayBars[barTwoIdx].style.backgroundColor = color;
                } else {
                    const [barIdx, newHeight] = animation.values;
                    arrayBars[barIdx].style.height = `${newHeight}px`;
                    newArray[barIdx] = newHeight;
                    setArray([...newArray]);
                }
            }, i * ANIMATION_SPEED_MS);
        });

        setTimeout(() => {
            setShowExplanation(true);
            setSelectedAlgorithm(algorithmName);
        }, animations.length * ANIMATION_SPEED_MS);
    };

    const handleExplanationClose = () => {
        setShowExplanation(false);
        setSorting(false);
    };

    return (
        <div className="container">
            <h1 className="text-center mt-4">See The Sort</h1>
            <div className="array-container">
                {array.map((value, idx) => (
                    <div
                        className="array-bar"
                        key={idx}
                        style={{ height: `${value}px`, backgroundColor: getBarColor(value, maxValue) }}
                    >
                        <span className="bar-text">{value}</span>
                    </div>
                ))}
            </div>

            {!sorting && !showExplanation && (
                <div className="button-group">
                    <button className="btn-merge" onClick={() => handleSort(getMergeSortAnimations, 'Merge Sort')}>Merge Sort</button>
                    <button className="btn-quick" onClick={() => handleSort(getQuickSortAnimations, 'Quick Sort')}>Quick Sort</button>
                    <button className="btn-insertion" onClick={() => handleSort(getInsertionSortAnimations, 'Insertion Sort')}>Insertion Sort</button>
                    <button className="btn-bubble" onClick={() => handleSort(getBubbleSortAnimations, 'Bubble Sort')}>Bubble Sort</button>
                    <button className="btn-reset" onClick={resetArray}>Generate Array</button>
                </div>
            )}

            {showExplanation && <ExplanationTree algorithm={selectedAlgorithm} onClose={handleExplanationClose} />}
        </div>
    );
};

export default SortingVisualizer;
