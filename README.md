# project_3

## Overview

This project analyzes a dataset of alternative fuel stations tracked by the U.S Department of Energy from 1976 through 2023 (https://developer.nrel.gov/docs/transportation/alt-fuel-stations-v1/get/). The dataset is updated on a monthly basis with the last update occurring on 8/11/23. There are several directories included in this repository. The "Resources" folder contains a .db file and .csv file of the dataset we used. The ETL folder contains files used to extract the data from the API source, transform and clean it, and exported into formats compatible for importing into Mongo DB.

The Flask_App folder contains a script that we created to develop routes which share general descriptive data on alternative fuel stations. An Analysis folder was also included with a jupyter notebook file of extensive analysis of the data including several types of charts and graphs. There are also 3 different folders containing dashboards which visualize electric fuel station across different variables including type of access, availability of station, and charging speed of the stations as both maps and charts.

Throughout this project, we relied on the following programs and dependencies: Jupyter Notebook, Pandas, MongoDB, Flask, Leaflet, JavaScript, and OpenStreetMaps. The powerpoint file contains additional information on sources cited and summarizes the analysis process and findings.

Collaborators: Gabrielle Bedewi, Francesca Palik, and Abel Habte
