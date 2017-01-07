//Script by Bigxixi
//contact: xixi@bigxixi.com
//build the UI
var drawUI = UI(this);
if(drawUI instanceof Window){
		drawUI.center();
		drawUI.show();
}else{
	drawUI.layout.layout(true);
}

function UI(thisObj){
	var win = (thisObj instanceof Panel) ? thisObj : new Window("palette","AE Script Runner",undefined,{resizeable:true,});
	if(win != null){
		if(!app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY")){
			alert("Please check this option:\n'Preferences->General->Allow Scripts to Write Files and Access Network'");
			app.executeCommand(2359);
			alert("Please rerun the script.")
		}else{
			var selfPath = decodeURI($.fileName);
			var configPath = selfPath.substring(0,selfPath.lastIndexOf('/') + 1) + "AEScriptRunnerConfig";
			var configFile = new File(configPath);
			var configs = [];
			if(configFile.exists){
				configFile.open("r");
				while(!configFile.eof){
					configs.push(configFile.readln());
				}
				configFile.close();
			}else{
				configs = [ "app.project.activeItem.selectedLayers;",
							"alert(\'......\');",
							"prompt(\'Type Something\',\'\');",
							"app.beginUndoGroup(\'Name It\');",
							"app.endUndoGroup();",
							"pick a jsx file"];
				configFile.open("w");
				for(var i=0;i<configs.length;i++){
					configFile.write(configs[i]);
				}
				configFile.close();
			}
			
			var pal1 = win.add("panel");
				pal1.text = "Run From File";
				pal1.orientation = "column";
				pal1.alignChildren = "Fill";
			var jsxPath = pal1.add("edittext",{x:0,y:0,width:300,height:20},"");
				jsxPath.text = configs[configs.length-1];
			var grp2 = pal1.add("group");
				grp2.orientation = "row";
			var pickJsxBtn = grp2.add("button",undefined,"Pick JSX");
				pickJsxBtn.onClick = getJSXPath;
			var runJsxBtn = grp2.add("button",undefined,"Run Path");
				runJsxBtn.onClick = runJSX;
			var saveJsxPathBtn = grp2.add("button",undefined,"Save Path");
				saveJsxPathBtn.onClick = saveConfigs;
			var pal0 = win.add("panel");
				pal0.text = "Run From Code Below"
				pal0.orientation = "column";
				pal0.alignChildren = "Fill";
			var grp1 = pal0.add("group");
				grp1.orientation = "row";
				grp1.alignChildren = "Fill";
			var clsBtn = grp1.add("button",undefined,"Clear");
				clsBtn.onClick = clsTexts;
			var runBtn = grp1.add("button",undefined,"Run");
				runBtn.onClick = function(){
					eval(script.text);		
				};
			var savBtn = grp1.add("button",undefined,"Save");
				savBtn.onClick  = saveText;
			var script = pal0.add("edittext",{x:0,y:0,width:300,height:120},"//Paste your code here, and run to test.",{multiline:true});
			var grp3 = pal0.add("group");
				grp3.orientation = "column";
				grp3.alignChildren = "Fill";
			var grp31 = grp3.add("group");
				grp31.orientation = "row";
			var addToListBtn = grp31.add("button",undefined,"New Item ↓");
				addToListBtn.onClick = addCode;
			var delSlBtn = grp31.add("button",undefined,"Delete Item ↓");
				delSlBtn.onClick = deleteItem;
			var saveListBtn = grp31.add("button",undefined,"Save Items ↓");
				saveListBtn.onClick = saveConfigs;
			var codeList = grp3.add("listbox",undefined,"Quick Script",{numberOfColumns: 1,showHeaders: true,columnTitles: ["Double Click to add to script."]});
			for(var i=0;i<configs.length-1;i++){
				codeList.add('item',configs[i]);
			}
				codeList.onDoubleClick = appandCode;
				
			function saveText(){
				var saveJSX = File.saveDialog();
				saveJSX = decodeURI(saveJSX);
				if(saveJSX != null){
					if(saveJSX.substring(saveJSX.lastIndexOf("."),saveJSX.length).toLowerCase() != ".jsx"){
						saveJSX = saveJSX + ".jsx";
					}
					var saveJSXFile = File(saveJSX);
						saveJSXFile.open("w");
						saveJSXFile.write(script.text);
						saveJSXFile.close();
				}
				alert("File save at:\n"+saveJSX);
			}
			function clsTexts(){
					script.text = "";
				};
			function addCode(){
					var newCode = prompt('Type new code and hit OK','value');
					if(newCode != null){
						codeList.add('item',newCode);
					}else{
						alert("Nothing added.");
					}
				};
			function deleteItem(){
				if(codeList.selection != null){
					codeList.remove(codeList.selection);
				}else{
					alert("Nothing Selecteed!");
				}
			}
			function appandCode(){
				if(codeList.selection != null){
					script.text += codeList.selection.toString() + "\n";
				}else{
					alert("Nothing Selecteed!");
				}
			};
			function getJSXPath(){
				var getJSX = File.openDialog();
				if(getJSX != null){
					jsxPath.text = decodeURI(getJSX);
					runJSX();
				}
			}
			function runJSX(){
				var JSXFile = new File(jsxPath.text);
				if(JSXFile.exists){
					JSXFile.open("r");
					var jsxTemp = JSXFile.read();
					JSXFile.close();
					eval(jsxTemp);
				} else{
					alert("Can not find the JSX file.");
				}
			}
			function saveConfigs(){
				configFile = new File(configPath);
				configs = [];
				for(var i=0;i<codeList.items.length;i++){
					var itemTemp = codeList.items[i].toString() + "\n";
					configs.push(itemTemp);
				}
				var jsxPathTemp = jsxPath.text;
				configs.push(jsxPathTemp);
				configFile.open("w");
				for(var i=0;i<configs.length;i++){
					configFile.write(configs[i]);
				}
				configFile.close();
				alert("saved.");
			}

		}
	}else{
		alert("Faile to run the script, please try again.");
	}
	return win;
}




