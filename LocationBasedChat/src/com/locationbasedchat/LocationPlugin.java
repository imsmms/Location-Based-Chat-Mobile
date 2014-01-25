package com.locationbasedchat;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;

public class LocationPlugin extends CordovaPlugin {

	private CallbackContext callback;

	/**
	 * @param args
	 */
	public static void main(String[] args) {

	}

	@Override
	public boolean execute(String action, String rawArgs,
			CallbackContext callbackContext) throws JSONException {

		Log.d(LocationPlugin.class.getSimpleName(), "execute() call");
		if (action.equals("getLocation")) {
			callback = callbackContext;
			getLocation();
			return true;
		}

		return false;
	}

	private void getLocation() {
		Log.d(LocationPlugin.class.getSimpleName(), "getLocation() call");
		getLocation(this.cordova.getActivity().getApplicationContext());
		Log.d(LocationPlugin.class.getSimpleName(), "getLocation() begins");
	}

	private void getLocation(Context context) {

		// Acquire a reference to the system Location Manager
		LocationManager locationManager = (LocationManager) context
				.getSystemService(Context.LOCATION_SERVICE);



		// Define a listener that responds to location updates
		LocationListener locationListener = new LocationListener() {
			@Override
			public void onLocationChanged(android.location.Location location) {

				Log.d(LocationPlugin.class.getSimpleName(),
						"onLocationResult() call");
				try {
					if (callback != null) {

						JSONArray jsonLocation = new JSONArray();

						jsonLocation.put(location.getLatitude());
						jsonLocation.put(location.getLongitude());

						callback.success(jsonLocation);

					}
				} catch (JSONException e) {
					e.printStackTrace();
					callback.error("error...");
				} finally {
					callback = null;
				}
			}

			@Override
			public void onProviderDisabled(String provider) {

			}

			@Override
			public void onProviderEnabled(String provider) {

			}

			@Override
			public void onStatusChanged(String provider, int status,
					Bundle extras) {

			}
		};


		// Register the listener with the Location Manager to receive location
		// updates

		Criteria criteria = new Criteria();
		String bestProvider = locationManager.getBestProvider(criteria, false);

		locationManager.requestLocationUpdates(bestProvider, 0, 0, locationListener);


		//locationManager.requestLocationUpdates(
		//		LocationManager.NETWORK_PROVIDER, 0, 0, locationListener);
		Location loc = locationManager.getLastKnownLocation(bestProvider);
		Log.d(LocationPlugin.class.getSimpleName(), "getLocation() Ends");

		Log.d(LocationPlugin.class.getSimpleName(), "getLocation() Ends" + String.valueOf(loc.getLatitude()));

		try {
			if (callback != null) {

				JSONArray jsonLocation = new JSONArray();


				jsonLocation.put(loc.getLatitude());

				jsonLocation.put(loc.getLongitude());

				callback.success(jsonLocation);
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}
