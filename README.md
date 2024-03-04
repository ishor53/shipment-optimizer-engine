# shipment-optimizer-engine
Typescript based engine to optimize shipment destinations.

# Instructions
1. Make sure you have Node and npm installed globally in your machine.

2. Make sure you have typescript dependencies installed in your machine. If not installed you can use in your terminal:
    npm install --save typescript @types/node

3. Once you have your environment setup, clone the project, go to your repo directory and run the following in your command line: <br>
tsc ShipmentOptimizer.ts && node ShipmentOptimizer.js [your shipment destinations file] [your driver names file] <br>
     Example: <br>
        If you clone this repo you would run: <br>
        tsc ShipmentOptimizer.ts && node ShipmentOptimizer.js shipment.txt driver.txt <br>


# Constraints:
 1. The engine assumes that the file provide in the command line is in the same directory as the main file is in.

 2. The engine do not handle malformed input for addresses or name lines.

 3. If the street name consists of '.' characters it strips that and does not count that in length.

 4. Output is printed as:

    Total Suitability Score: 34 <br>
    Optimal Assignment: <br>
    (UPPER CASE ADDRESS) is assigned to (UPPER CASE NAME) <br>


