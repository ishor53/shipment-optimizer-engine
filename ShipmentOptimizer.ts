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
    
    const baseScore = shipment.length % 2 === 0 ? driver.vowels * 1.5 : driver.consonants;

    const commonFactors = getCommonFactors(driver.nameLength, shipment.length);

    // recalculate baseScore based on commonFactors
    return commonFactors.length > 0 ? baseScore * 1.5 : baseScore;
}

// search for common factors between two numbers
function getCommonFactors(a: number, b: number): number[] {
    const factors: number[] = [];
    for (let i = 2, max = Math.min(a, b); i <= max; i++) {
        if (a % i === 0 && b % i === 0) {
            factors.push(i);
        }
    }
    return factors;
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

function printAssignmentDetails(assignment: ShipmentDestination[], drivers: Driver[]): void {
    assignment.forEach((s, i) => console.log(s.destinationAddress.toUpperCase(), 'is assigned to', drivers[i].name.toUpperCase()));
}

function main() {
    try {
        const shipmentDestinations = [
            '123 Elm Street, Scary Town, IN, 55555',
            '1345 Sesame Street, Sesame Town, IN, 55555',
            '3532 Pacific Beach Drive, Pacific Beach, CA, 55555',
            '11 Atlantic Avenue, Atlantic City, NJ, 55555',
            '123123 Beach Boulevard, The Beach, CA, 12312',
            '5235 Hotel Circle, San Diego, CA, 12314',
            '623 Evergreen Terrace, Portland, OR, 15125'
        ].map(val => new ShipmentDestination(val));

        const drivers = [
            'Charles Darwin', 'Marcus Aurelius',
            'John Doe',
            'Jane Doe',
            'Bruce Wayne',
            'Peter Parker',
            'Clark Kent'
        ].map(val => new Driver(val));

        const [totalScore, assignment] = searchOptimalAssignment(shipmentDestinations, drivers);

        console.log('Total Suitability Score:', totalScore);
        console.log('Optimal Assignment:');
        printAssignmentDetails(assignment, drivers);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
