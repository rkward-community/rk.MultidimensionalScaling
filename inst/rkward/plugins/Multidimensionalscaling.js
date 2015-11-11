// this code was generated using the rkwarddev package.
//perhaps don't make changes here, but in the rkwarddev script instead!

// define variables globally
var frameSelectedVarsChecked;
var selectedVarsShortname;
var frameDataPrepEnabled;

function setGlobalVars(){
  frameSelectedVarsChecked = getValue("frameSelectedVars.checked");
  selectedVarsShortname = getValue("selectedVars.shortname").split("\n").join("\", \"");
  frameDataPrepEnabled = getValue("frameDataPrep.enabled");
}

function preprocess(){
  setGlobalVars();
  // add requirements etc. here
  echo("require(MASS)\n");
}

function calculate(){
  // read in variables from dialog
  
  var data = getString("data");
  var selectedVars = getString("selectedVars");
  var saveResults = getString("saveResults");
  var ndim = getString("ndim");
  var distMethod = getString("distMethod");
  var pwrMinkowski = getString("pwrMinkowski");
  var scaleMethod = getString("scaleMethod");
  var maxIter = getString("maxIter");
  var textSize = getString("textSize");
  var textPos = getString("textPos");
  var omitNA = getBoolean("omitNA.state");
  var scale = getBoolean("scale.state");
  var plotResults = getBoolean("plotResults.state");
  var frameSelectedVarsChecked = getBoolean("frameSelectedVars.checked");
  var framePlotLabelsChecked = getBoolean("framePlotLabels.checked");

  // the R code to be evaluated
  var frameSelectedVarsChecked = getValue("frameSelectedVars.checked");
  var selectedVarsShortname = getValue("selectedVars.shortname").split("\n").join("\", \"");
  var frameDataPrepEnabled = getValue("frameDataPrep.enabled");
  if(frameSelectedVarsChecked && selectedVarsShortname != "") {
    comment("Use subset of variables", "  ");  
    echo("\t" + data + " <- subset(" + data + ", select=c(\"" + selectedVarsShortname + "\"))\n");  
  }
  if(frameDataPrepEnabled && omitNA) {
    comment("Listwise removal of missings", "  ");  
    echo("\t" + data + " <- na.omit(" + data + ")\n");  
  }
  if(frameDataPrepEnabled && scale) {
    comment("Standardizing values", "  ");  
    echo("\t" + data + " <- scale(" + data + ")\n");  
  }
  if(frameDataPrepEnabled) {
    comment("Compute distance matrix", "  ");  
    echo("\tmds.distances <- dist(");  
    if(data) {
      echo("\n\t\tx=" + data);  
    }  
    echo(",\n\t\tmethod=\"" + distMethod + "\"");  
    if(distMethod == "minkowski") {
      echo(",\n\t\tp=" + pwrMinkowski);  
    }  
    echo("\n\t)\n");  
    comment("The actual multidimensional scaling", "  ");  
    echo("\tmds.result <- " + scaleMethod + "(");  
    if(data) {
      echo("\n\t\td=mds.distances");  
    }  
    echo(",\n\t\tk=" + ndim);  
    if(scaleMethod == "isoMDS") {
      echo(",\n\t\tmaxit=" + maxIter);  
    } else if(scaleMethod == "sammon") {
      echo(",\n\t\tniter=" + maxIter);  
    }  
    echo("\n\t)\n\n");  
  } else {
    comment("The actual multidimensional scaling", "  ");  
    echo("\tmds.result <- " + scaleMethod + "(");  
    if(data) {
      echo("\n\t\td=" + data);  
    }  
    echo(",\n\t\tk=" + ndim);  
    if(scaleMethod == "isoMDS") {
      echo(",\n\t\tmaxit=" + maxIter);  
    } else if(scaleMethod == "sammon") {
      echo(",\n\t\tniter=" + maxIter);  
    }  
    echo("\n\t)\n\n");  
  }
}

function printout(){
  // all the real work is moved to a custom defined function doPrintout() below
  // true in this case means: We want all the headers that should be printed in the output:
  doPrintout(true);
}

function preview(){
  preprocess();
  calculate();
  doPrintout(false);
}

function doPrintout(full){
  // read in variables from dialog
  
  var data = getString("data");
  var selectedVars = getString("selectedVars");
  var saveResults = getString("saveResults");
  var ndim = getString("ndim");
  var distMethod = getString("distMethod");
  var pwrMinkowski = getString("pwrMinkowski");
  var scaleMethod = getString("scaleMethod");
  var maxIter = getString("maxIter");
  var textSize = getString("textSize");
  var textPos = getString("textPos");
  var omitNA = getBoolean("omitNA.state");
  var scale = getBoolean("scale.state");
  var plotResults = getBoolean("plotResults.state");
  var frameSelectedVarsChecked = getBoolean("frameSelectedVars.checked");
  var framePlotLabelsChecked = getBoolean("framePlotLabels.checked");

  // create the plot
  if(full) {
    new Header(i18n("Multidimensional scaling")).print();
  }

  var framePlotLabelsChecked = getValue("framePlotLabels.checked");
  if(plotResults) {
    echo("\n");  
    var textColCodePrintout = getValue("textCol.code.printout");  
        // in case there are generic plot options defined:
    var genPlotOptionsCodePreprocess = getValue("genPlotOptions.code.preprocess");
    var genPlotOptionsCodePrintout = getValue("genPlotOptions.code.printout");
    var genPlotOptionsCodeCalculate = getValue("genPlotOptions.code.calculate");

    if(full) {
      echo("rk.graph.on()\n");
    }
    echo("    try({\n");

    // insert any option-setting code that should be run before the actual plotting commands:
    printIndentedUnlessEmpty("      ", genPlotOptionsCodePreprocess, "\n", "");

    // the actual plot:
    // label text color:
    echo("\t\tplot(mds.result");
    if(scaleMethod == "isoMDS" || scaleMethod == "sammon") {
      echo("[[\"points\"]]");  
    }
    if(!genPlotOptionsCodePrintout.match(/main\s*=/)) {
      echo(",\n\t\t\tmain=\"Multidimensional scaling\"");  
    }
    if(!genPlotOptionsCodePrintout.match(/sub\s*=/)) {
      echo(",\n\t\t\tsub=\"Solution with " + ndim + " dimensions (" + scaleMethod + ")\"");  
    }
    if(framePlotLabelsChecked && textPos == 0) {
      echo(",\n\t\t\ttype=\"n\"");  
    }
    echo(genPlotOptionsCodePrintout.replace(/, /g, ",\n\t\t\t"));
    echo(")");
    if(framePlotLabelsChecked) {
      echo("\n\t\ttext(mds.result");  
      if(scaleMethod == "isoMDS" || scaleMethod == "sammon") {
        echo("[[\"points\"]],\n\t\t\trownames(mds.result[[\"points\"]])");  
      } else {
        echo(",\n\t\t\trownames(mds.result)");  
      }  
      if(textSize != 1) {
        echo(",\n\t\t\tcex=" + textSize);  
      }  
      if(textPos != 0) {
        echo(",\n\t\t\tpos=" + textPos);  
      }  
      echo(textColCodePrintout + ")");  
    }

    // insert any option-setting code that should be run after the actual plot:
    printIndentedUnlessEmpty("      ", genPlotOptionsCodeCalculate, "\n", "");

    echo("\n    })\n");
    if(full) {
      echo("rk.graph.off()\n");
    }  
  }
  if(full) {
    echo("\nrk.print(mds.result)\n");  
    if(frameSelectedVarsChecked && selectedVarsShortname != "") {
      new Header(i18n("Subset of variables included the analysis"), 3).print();  
      echo("rk.print(list(\"" + selectedVarsShortname + "\"))\n\n");  
    }  
  }

  // left over from the printout function

  //// save result object
  // read in saveobject variables
  var saveResults = getValue("saveResults");
  var saveResultsActive = getValue("saveResults.active");
  var saveResultsParent = getValue("saveResults.parent");
  // assign object to chosen environment
  if(saveResultsActive) {
    echo(".GlobalEnv$" + saveResults + " <- mds.result\n");
  }


}