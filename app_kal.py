import os

import pandas as pd
import numpy as np
import json
import geojson

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

#app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/trafficking.sqlite"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/meansofcontrol.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)
# Save references to each table
Base.classes.keys()
Meansofcontrol = Base.classes.meansofcontrol
Meansdata_age = Base.classes.meansdata_age
Meansdata_gender = Base.classes.meansdata_gender

# create the function
def df_to_geojson(df, properties, latitude='latitude', longitude='longitude'):
    """
    Turn a dataframe containing point data into a geojson formatted python dictionary

    df : the dataframe to convert to geojson
    properties : a list of columns in the dataframe to turn into geojson feature properties
    lat : the name of the column in the dataframe that contains latitude data
    lng : the name of the column in the dataframe that contains longitude data
    """

    # create a new python dict to contain our geojson data, using geojson format
    geojson = {'type':'FeatureCollection', 'features':[]}

    # loop through each row in the dataframe and convert each row to geojson format
    # x is the equivalent of the row, df.iterrows converts the dataframe in to a pd.series object
    # the x is a counter and has no influence
    for x, row in df.iterrows():

        feature = {'type':'Feature',
                   'properties':{},
                   'geometry':{'type':'Point',
                               'coordinates':[]}}

        # fill in the coordinates
        feature['geometry']['coordinates'] = [float(row.longitude),float(row.latitude)]

        # convert the array to a pandas.serie
        geo_props = pd.Series(row)

        # for each column, get the value and add it as a new feature property
        # prop determines the list from the properties
        for prop in properties:

            #loop over the items to convert to string elements

            #convert to string
            if type(geo_props[prop]) == float:
                #print('ok')
                geo_props[prop] = str(int(geo_props[prop]))

            # now create a json format, here we have to make the dict properties
            feature['properties'][prop] = geo_props[prop]

        # add this feature (aka, converted dataframe row) to the list of features inside our dict
        geojson['features'].append(feature)
    return geojson

@app.route("/")
def index():
    """Return the homepage."""
    return "Hello world"

@app.route("/data/control")
def controlData():
    """Return control method by country data"""

@app.route("/data/control-age")
def controlAgeData():
    stmt = db.session.query(Meansdata_age).statement
    meansdata_age_df = pd.read_sql_query(stmt, db.session.bind)
    # Create an empty list 
    Row_list =[] 
# Iterate over each row 
    for rows in meansdata_age_df.itertuples(): 
       my_list =[ rows.Index,rows.adult, rows.child] 
       Row_list.append(my_list) 
    
    return jsonify(Row_list)

@app.route("/visualizations/control")
def controlVisualization():
    stmt = db.session.query(Meansofcontrol).order_by(meansofcontrol_total.desc()).statement
    meansofcontrol_sort_df = pd.read_sql_query(stmt, db.session.bind)
    df_to_geojson(meansofcontrol_sort_df,col_list,'latitude','longitude')
    
    """Return control method by country visualization"""
    return render_template('control-map.html')

@app.route("/visualizations/control-age")
def controlAgeVisualization():
    stmt = db.session.query(Meansdata_age).statement
    meansdata_age_df = pd.read_sql_query(stmt, db.session.bind)
    # Create an empty list 
    Row_list =[] 
# Iterate over each row 
    for rows in meansdata_age_df.itertuples(): 
       my_list =[ rows.Index,rows.adult, rows.child] 
       Row_list.append(my_list) 
    
    """Return control method by country visualization"""
    return render_template('control-age.html')

@app.route("/visualizations/control-gender")
def controlGenderVisualization():
    stmt = db.session.query(Meansdata_gender).statement
    meansdata_gender_df = pd.read_sql_query(stmt, db.session.bind)
    
    Row_lst =[] 
    for rows in meansdata_gender_df.itertuples(): 
        my_lst =[ rows.Index,rows.Male, rows.Female] 
        Row_lst.append(my_lst) 
    
    return render_template('control-gender.html')

@app.route("/visualizations/labour-map")
def labourMapVisualization():
    return render_template('labour-map.html')

if __name__ == "__main__":
    app.run()
