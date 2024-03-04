import * as fs from 'fs';

class Driver {
    name: string;
    nameLength: number;
    vowels: number;
    consonants: number;

    constructor(name: string) {
        this.name = name;
        this.nameLength = this.calculateNameLength(name);
        this.vowels = this.countVowels();
        this.consonants = this.countConsonants();
    }

    // method to format the driver's name length
    private calculateNameLength(name: string): number {
        return name.toLowerCase().replace(/\s/g, "").length;
    }

    // method to count the number of vowels in the driver's name
    private countVowels(): number {
        return (this.name.match(/[aeiou]/gi) || []).length;
    }

    // method to count the number of consonants in the driver's name
    private countConsonants(): number {
        return (this.name.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
    }
}


class ShipmentDestination {
    destinationAddress: string;
    street: string;
    length: number;

    constructor(line: string) {
        this.destinationAddress = line;
        this.street = this.retrieveStreetName(line);
        this.length = this.calculateLength(line);
    }

    // method to retrieve the street name from the shipment line
    private retrieveStreetName(line: string): string {
        return line.split(",")[0].replace(/\./g, "");
    }

    // method to  calculate the length of the shipment
    private calculateLength(line: string): number {
        return line.replace(/\s/g, "").split(",")[0].replace(/\./g, "").length;
    }
}

// calculate the suitability score for a driver and shipment destination pair
function calculateScore(driver: Driver, shipment: ShipmentDestination): number {
    
    const baseScore = shipment.length % 2 === 0 ? driver.vowels * 1.5 : driver.consonants * 1;

    const commonFactors = getCommonFactors(driver.nameLength, shipment.length);

    // recalculate baseScore based on commonFactors
    return commonFactors.length > 0 ? baseScore * 1.5 : baseScore;
}

// search for common factors between two numbers
function getCommonFactors(a: number, b: number): number[] {
    return Array.from({ length: Math.min(a, b) - 1 }, (_, i) => i + 2)
        .filter(i => a % i === 0 && b % i === 0);
}

// search for the best shipment assignment for a given set of destinations and drivers
function searchOptimalAssignment(shipmentDestinations: ShipmentDestination[], drivers: Driver[]): [number, ShipmentDestination[]] {
    // compute all permutations of shipment assignments
    const permutations = computePermutations(shipmentDestinations);

    let maxScore = 0;
    let optimalAssignment: ShipmentDestination[] | null = null;

    // run through each permutation to find the best assignment with respect to driver
    for (const permutation of permutations) {
        // find the total suitability score for the current assignment
        const totalScore = getTotalSuitabilityScore(drivers, permutation);

        // analyze optimal assignment if the current assignment has a higher score
        if (totalScore > maxScore) {
            maxScore = totalScore;
            optimalAssignment = permutation;
        }
    }

    // Return the optimal assignment and its total score
    return [maxScore, optimalAssignment!];
}

// find the total suitability score for a set of drivers and destination
function getTotalSuitabilityScore(drivers: Driver[], shipment: ShipmentDestination[]): number {
    return drivers.reduce((acc, driver, i) => acc + calculateScore(driver, shipment[i]), 0);
}

// Function to generate all permutations of an array
function computePermutations<T>(array: T[]): T[][] {
    return array.length === 0 ? [[]] :
        array.flatMap((item, i) => computePermutations([...array.slice(0, i), ...array.slice(i + 1)]).map(perm => [item, ...perm]));
}

// data reader function
function readDataFromFile(filePath: string): string[] {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8').trim();
        return fileContent.split('\n');
    } catch (error) {
        throw new Error(`Unable to read file "${filePath}": ${error.message}`);
    }
}

function printAssignmentDetails(assignment: ShipmentDestination[], drivers: Driver[]): void {
    assignment.forEach((s, i) => console.log(s.destinationAddress.toUpperCase(), 'is assigned to', drivers[i].name.toUpperCase()));
}

function main() {
    try {
        // Read shipment destination and driver data from files and create objects
        const shipmentDestinations = readDataFromFile(process.argv[2]).map(line => new ShipmentDestination(line));
        const drivers = readDataFromFile(process.argv[3]).map(name => new Driver(name));

        // search optimal assigment from data
        const [totalScore, assignment] = searchOptimalAssignment(shipmentDestinations, drivers);

        console.log('Total Suitability Score:', totalScore);
        console.log('Optimal Assignment:');
        printAssignmentDetails(assignment, drivers);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// execute the main function to start the application
main();

