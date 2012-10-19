package com.jared.hellophonegap;

import android.os.Bundle;
import com.jaredabel.visualkeeper.R;
import org.apache.cordova.*;
public class HelloPhonegapActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.splash);
        super.loadUrl("file:///android_asset/www/index.html", 4000);
    }
}