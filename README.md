# Mission Planning Interface

This is a mission planning interface for [Lobster Robotics](https://www.lobster-robotics.com/) using [Next.js](https://nextjs.org). It is a web-based interface that allows users to define regions for the Lobster Scout to survey and then visualize the survey path.

[![Watch the video](https://drive.google.com/uc?export=view&id=1as0BN9HfjfyxghbFS1zy6I-n6XBtaWF2)](https://drive.google.com/file/d/1dfc_nmKimF-jQPyJ_Nyb6BF-q0i6XKsi/view?usp=sharing
)

## Prerequisites

This project was built and tested on Ubuntu 22.04. Make sure Node.js v20.17.0 (LTS) is installed. I used nvm to install Node.js. See the [Node.js Download Page](https://nodejs.org/en/download/package-manager) for more info.


## Getting Started

Clone the repository and install the dependencies:

```bash
git clone https://github.com/rickyjericevich/lobster-mission-planning-ui
cd lobster-mission-planning-ui
```

Install the dependencies:

```bash
npm install
```

Finally, the easiest way to test the app is to run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Map Controls

- **Pan**: Click and drag the map to pan around.
- **Adjust Pitch**: Hold Ctrl on Windows and then click and drag the map to adjust the pitch.
- **Adjust map bearing**: Same keys as adjusting the pitch, however you can also click and drag the compass at the top right of the screen to adjust the map bearing. 
- **Zoom**: Scroll up or down to zoom in or out, or use the zoom buttons on the top right of the screen. To automatically zoom in on your current location, click the Location button on the top left.
- **Draw Polygon**: By default, you should be able to immediately start drawing a polygon by clicking on the map. This is indicated by the crosshair cursor on the screen. Each click will create a new vertex of the polygon. Double click to finish the polygon. **Only one polygon can exist on the map.**
- **Edit Polygon**: Once the polygon has been drawn, you can modify it by clicking and dragging the vertices. You can also create more vertices by clicking and dragging the center point of each edge of the polygon. You can shift (translate) the entire polygon by selecting it and dragging it.
- **Delete Polygon**: While creating the polygon, you can delete it entirely by pressing these keys: Delete, Escape, Enter. Once the polygon has been created, you can also delete it by using the delete button at the top left of the screen. You can also delete a vertex by selecting it and pressing the delete key.
- **Coverage Path**: Once the polygon has been created, a sidebar will pop which allows you to define the parameters needed to create a path that the Scout can use to survey the area.

## Gotchas

Given the time constraints, there are a few things that I should mention about the app:

1. I implemented my own form of a Coverage Path Planning algorithm from first principles, so naturally it is a bit crude. It's defintely not optimal and is for demonstration purposes only, and should be replaced by an algorithm like the one found in [this paper](https://www.sciencedirect.com/science/article/abs/pii/S0029801824012484?fr=RR-2&ref=pdf_download&rr=8ce874d48da40382).

2. Among other things, it doesn't support concave polygons and it makes use of a lot of approximations that affect the optimality of area coverage.

3. Naturally there are a lot of improvements that could be made to the UI, the Coverage Path alogorithm and the code itself, but the core functionality is there.