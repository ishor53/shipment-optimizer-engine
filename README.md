# shipment-optimizer-engine
Typescript based engine to optimize shipment destinations.

# Instructions
1. Make sure you have Node and npm installed globally in your machine.

2. Make sure you have typescript dependencies installed in your machine. If not installed you can use in your terminal:
    npm install --save typescript @types/node

3. Once you have your environment setup, clone the project, go to your repo directory and run the following in your command line: <br>
tsc ShipmentOptimizer.ts && node ShipmentOptimizer.js 
     Example: <br>
        If you clone this repo you would run: <br>
        tsc ShipmentOptimizer.ts && node ShipmentOptimizer.js


# Constraints:
 1. The engine do not handle malformed input for addresses or name lines.

 2. If the street name consists of '.' characters it strips that and does not count that in length.

 3. Output is printed as:

    Total Suitability Score:  <br>
    Optimal Assignment: <br>
    (UPPER CASE ADDRESS) is assigned to (UPPER CASE NAME) <br>

# Revisions(3-11-2024):
 1. The engine now supplies test values as required rather than reading from file.

 2. The Array.from in getCommonFactors is refactored to use for loop since this can be performance critical. Similarly there are other opportunities in the code where forEach, maps , and reduce could be refactored for performance improvement.


