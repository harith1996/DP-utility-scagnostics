import {distance} from "./kruskal-mst";

export class RectangularBinner {
    constructor(points, gridNumber) {
        //TODO: Should check if there are more than 3 unique values here or even after the binning.
        //TODO: May need to clone the points to avoid modifying it, but we don't do to reserve other data or to make the process faster
        // //Clone these to avoid modifying them
        // this.points = points.map(p=>p.slice(0));
        this.points = points;
        this.gridNumber = gridNumber;
        this.gridSize = 1.0 / gridNumber;
    }

    get rectangles() {
        let self = this;
        let points = this.points;
        let gridNumber = this.gridNumber;
        let gridSize = 1.0 / gridNumber;
        let bins = [];
        for (let i = 0; i < gridNumber; i++) {
            let b = [];
            for (let j = 0; j < gridNumber; j++) {
                b = [];//bin as an empty array.
            }
            bins.push(b);
        }

        let n = points.length;
        for (let pi = 0; pi < n; pi++) {
            let point = points[pi];
            let x = point[0];
            let y = point[1];
            let j = x == 1 ? gridNumber - 1 : Math.floor(x / gridSize);
            let i = y == 0 ? gridNumber - 1 : Math.floor((1 - y) / gridSize);
            bins[i][j].push(point);
        }
        return bins;
    }
}
