// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!

// define variables globally
var frameSelectedVarsChecked;
var selectedVarsShortname;
var frameDataPrepEnabled;

function setGlobalVars(){
  frameSelectedVarsChecked = getValue("frameSelectedVars.checked");
  selectedVarsShortname = getValue("selectedVars.shortname").split("\n").join("\", \"");
  frameDataPrepEnabled = getValue("frameDataPrep.enabled");
}

function preview(){
  preprocess(true);
  calculate(true);
  printout(true);
}

function preprocess(is_preview){
  setGlobalVars();
  // add requirements etc. here
  if(is_preview) {
    echo("if(!base::require(MASS)){stop(" + i18n("Preview not available, because package MASS is not installed or cannot be loaded.") + ")}\n");
  } else {
    echo("require(MASS)\n");
  }
}

function calculate(is_preview){
  // read in variables from dialog
  var data = getString("data");
  var selectedVars = getString("selectedVars");
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
  var framePlotLabelsChecked = getBoolean("framePlotLabels.checked");

  // the R code to be evaluated
  var frameSelectedVarsChecked = getValue("frameSelectedVars.checked");
  var selectedVarsShortname = getValue("selectedVars.shortname").split("\n").join("\", \"");
  var frameDataPrepEnabled = getValue("frameDataPrep.enabled");
  if(frameSelectedVarsChecked && selectedVarsShortname != "") {
    comment("Use subset of variables", "  ");  
    echo("\t" + data + " <- subset(" + data + ", select=c(\"" + selectedVarsShortname + "\"))\n");  
  } else {}
  if(frameDataPrepEnabled && omitNA) {
    comment("Listwise removal of missings", "  ");  
    echo("\t" + data + " <- na.omit(" + data + ")\n");  
  } else {}
  if(frameDataPrepEnabled && scale) {
    comment("Standardizing values", "  ");  
    echo("\t" + data + " <- scale(" + data + ")\n");  
  } else {}
  if(frameDataPrepEnabled) {
    comment("Compute distance matrix", "  ");  
    echo("\tmds.distances <- dist(");  
    if(data) {
      echo("\n\t\tx=" + data);  
    } else {}  
    echo(",\n\t\tmethod=\"" + distMethod + "\"");  
    if(distMethod == "minkowski") {
      echo(",\n\t\tp=" + pwrMinkowski);  
    } else {}  
    echo("\n\t)\n");  
    comment("The actual multidimensional scaling", "  ");  
    echo("\tmds.result <- " + scaleMethod + "(");  
    if(data) {
      echo("\n\t\td=mds.distances");  
    } else {}  
    echo(",\n\t\tk=" + ndim);  
    if(scaleMethod == "isoMDS") {
      echo(",\n\t\tmaxit=" + maxIter);  
    } else if(scaleMethod == "sammon") {
      echo(",\n\t\tniter=" + maxIter);  
    } else {}  
    echo("\n\t)\n\n");  
  } else {
    comment("The actual multidimensional scaling", "  ");  
    echo("\tmds.result <- " + scaleMethod + "(");  
    if(data) {
      echo("\n\t\td=" + data);  
    } else {}  
    echo(",\n\t\tk=" + ndim);  
    if(scaleMethod == "isoMDS") {
      echo(",\n\t\tmaxit=" + maxIter);  
    } else if(scaleMethod == "sammon") {
      echo(",\n\t\tniter=" + maxIter);  
    } else {}  
    echo("\n\t)\n\n");  
  }
}

function printout(is_preview){
  // read in variables from dialog
  var data = getString("data");
  var selectedVars = getString("selectedVars");
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
  var framePlotLabelsChecked = getBoolean("framePlotLabels.checked");

  // printout the results
  if(!is_preview) {
    new Header(i18n("Multidimensional scaling")).print();  
  } else {}  var framePlotLabelsChecked = getValue("framePlotLabels.checked");
  if(plotResults) {
    echo("\n");  
    var textColCodePrintout = getValue("textCol.code.printout");  
        // in case there are generic plot options defined:
    var genPlotOptionsCodePreprocess = getValue("genPlotOptions.code.preprocess");
    var genPlotOptionsCodePrintout = getValue("genPlotOptions.code.printout");
    var genPlotOptionsCodeCalculate = getValue("genPlotOptions.code.calculate");

    if(!is_preview) {
    echo("rk.graph.on()\n");  
  } else {}
    echo("    try({\n");

    // insert any option-setting code that should be run before the actual plotting commands:
    printIndentedUnlessEmpty("      ", genPlotOptionsCodePreprocess, "\n", "");

    // the actual plot:
    // label text color:
    echo("\t\tplot(mds.result");
    if(scaleMethod == "isoMDS" || scaleMethod == "sammon") {
      echo("[[\"points\"]]");  
    } else {}
    if(!genPlotOptionsCodePrintout.match(/main\s*=/)) {
      echo(",\n\t\t\tmain=\"Multidimensional scaling\"");  
    } else {}
    if(!genPlotOptionsCodePrintout.match(/sub\s*=/)) {
      echo(",\n\t\t\tsub=\"Solution with " + ndim + " dimensions (" + scaleMethod + ")\"");  
    } else {}
    if(framePlotLabelsChecked && textPos == 0) {
      echo(",\n\t\t\ttype=\"n\"");  
    } else {}
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
      } else {}  
      if(textPos != 0) {
        echo(",\n\t\t\tpos=" + textPos);  
      } else {}  
      echo(textColCodePrintout + ")");  
    } else {}

    // insert any option-setting code that should be run after the actual plot:
    printIndentedUnlessEmpty("      ", genPlotOptionsCodeCalculate, "\n", "");

    echo("\n    })\n");
    if(!is_preview) {
    echo("rk.graph.off()\n");  
  } else {}  
  } else {}
  if(!is_preview) {
    echo("\nrk.print(mds.result)\n");  
    if(frameSelectedVarsChecked && selectedVarsShortname != "") {
      new Header(i18n("Subset of variables included the analysis"), 3).print();  
      echo("rk.print(list(\"" + selectedVarsShortname + "\"))\n\n");  
    } else {}  
  } else {}
  if(!is_preview) {
    //// save result object
    // read in saveobject variables
    var saveResults = getValue("saveResults");
    var saveResultsActive = getValue("saveResults.active");
    var saveResultsParent = getValue("saveResults.parent");
    // assign object to chosen environment
    if(saveResultsActive) {
      echo(".GlobalEnv$" + saveResults + " <- mds.result\n");
    } else {}  
  } else {}

}

