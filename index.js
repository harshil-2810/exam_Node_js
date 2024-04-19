const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Function to check if a phone number is valid
function isValidPhoneNumber(phoneNumber) {
    // Regex pattern to match the required format
    const pattern = /^\+91-\d{4}-\d{6}$/;
    return pattern.test(phoneNumber);
}

// Route to receive phone numbers and separate them
app.post('/checkNumbers', (req, res) => {
    const inputNumbers= [
        "+91-1234-567821",
        "1234-567822",
        "+911234-567823",
        "+91-1234-567824",  
        "+91-1234-567825",
        "+91-1234-567826",
        "+91-1234-567827",
        "+91-1234-5677",
    ];

    let validNumbers = [];
    let invalidNumbers = [];

    inputNumbers.forEach(number => {
        if (isValidPhoneNumber(number)) {
            validNumbers.push(number);
        } else {
            invalidNumbers.push(number);
        }
    });

    // Writing valid numbers to validNumber.txt
    fs.writeFile('validNumber.txt', validNumbers.join('\n'), err => {
        if (err) throw err;
        console.log('Valid numbers saved to validNumber.txt');
    });

    // Writing invalid numbers to invalidNumber.txt
    fs.writeFile('invalidNumber.txt', invalidNumbers.join('\n'), err => {
        if (err) throw err;
        console.log('Invalid numbers saved to invalidNumber.txt');
    });

    res.send('Phone numbers checked and separated!');
});

// ANSWER.2

// Route to handle input from URL query parameters
app.get('/convertAndSave', (req, res) => {
    const inputNumber = req.query.number;

    if (!inputNumber || inputNumber.length !== 10 || !/^\d+$/.test(inputNumber)) {
        return res.status(400).send('Error: Please provide a valid 10-digit numeric phone number');
    }

    const formattedNumber = `+91-${inputNumber.substring(0, 4)}-${inputNumber.substring(4)}`;

    // Writing formatted number to dataSet.txt
    fs.appendFile('dataSet.txt', formattedNumber + '\n', err => {
        if (err) throw err;
        console.log('Formatted number appended to dataSet.txt');
        res.send('Number formatted and saved!');
    });
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

// ANSWER.3

// Function to remove duplicates from an array
const removeDuplicates = (arr) => {
    return Array.from(new Set(arr));
};

const data = "The quick brown f-$ox jumps over the lazy** d)og";

// Function to separate characters into categories and write into respective files
const separateAndWriteToFile = (str) => {
    const vowels = [];
    const consonants = [];
    const specialChars = [];

    // Convert string to lowercase for case-insensitivity
    const lowercaseStr = str.toLowerCase();

    // Iterate through each character in the string
    for (let char of lowercaseStr) {
        if (/[aeiou]/.test(char)) {
            vowels.push(char);
        } else if (/[a-z]/.test(char)) {
            consonants.push(char);
        } else {
            specialChars.push(char);
        }
    }

    // Remove duplicates from each array
    const uniqueVowels = removeDuplicates(vowels);
    const uniqueConsonants = removeDuplicates(consonants);
    const uniqueSpecialChars = removeDuplicates(specialChars);

    // Write unique characters to respective files
    fs.writeFileSync('vowel.txt', uniqueVowels.join(''));
    fs.writeFileSync('consonants.txt', uniqueConsonants.join(''));
    fs.writeFileSync('special_character.txt', uniqueSpecialChars.join(''));
};

// Call the function with the given data
separateAndWriteToFile(data);

