/**
 * Unsymbol Me
 *
 * Copyright © 2017 Roman Shamin https://github.com/romashamin
 * and licenced under the MIT licence. All rights not explicitly
 * granted in the MIT license are reserved. See the included
 * LICENSE file for more details.
 *
 * https://github.com/romashamin/
 * https://twitter.com/romanshamin
 */


/*
 * @param {Object} symbolsData
 * @returns {string}
 */

function getMessageFromArgs(symbolsData) {
  let resultMessage = '';
  let masterPart    = '';
  let verb          = '';
  let instancePart  = '';

  // No master symbols, no instances
  if (symbolsData.masters.count === 0 && symbolsData.instances.count === 0) {
    resultMessage = 'select at least one symbol';
  }

  // If one or more masters
  if (symbolsData.masters.count === 1) {
    masterPart = `‘${symbolsData.masters.names[0]}’ symbol`;
  } else {
    masterPart = `${symbolsData.masters.count} symbols`;
  }

  // If one or more instances
  if (symbolsData.instances.count === 1) {
    const maybeName = symbolsData.instances.names[0];

    if (maybeName) {
      instancePart = `‘${maybeName}’ instance`;
    } else {
      instancePart = `1 instance`;
    }
  } else {
    instancePart = `${symbolsData.instances.count} instances`;
  }

  // One master + one instance?
  if (symbolsData.masters.count + symbolsData.instances.count === 1) {
    verb = 'has';
  } else {
    verb = 'have';
  }

  // No masters + some instances?
  if (symbolsData.masters.count === 0 && symbolsData.instances.count > 0) {
    resultMessage = `${instancePart} ${verb} been affected`;
  } else {
    resultMessage = `${masterPart} and ${instancePart} ${verb} been affected`;
  }

  return resultMessage;
}



/*
 * @param {NSArray} selection
 * @returns {string}
 */

function unsymbolAll(selection) {
  let symbolsData = {
    masters   : {
      names : [],
      count : 0
    },
    instances : {
      names : [],
      count : 0
    }
  };

  let loopSelection = selection.objectEnumerator();

  while (object = loopSelection.nextObject()) {
    if (object.isMemberOfClass(MSSymbolMaster.class())) {
      const masterSymbol = object;

      symbolsData.masters.names.push(masterSymbol.name());
      symbolsData.masters.count += 1;

      const affectedInstances = masterSymbol.allInstances().count();
      symbolsData.instances.count += affectedInstances;

      MSSymbolMaster.convertSymbolToArtboard(masterSymbol);
    } else if (object.isMemberOfClass(MSSymbolInstance.class())) {
      const instanceSymbol = object;

      symbolsData.instances.names.push(instanceSymbol.name());
      symbolsData.instances.count += 1;

      instanceSymbol.detachByReplacingWithGroup();
    }
  }

  return getMessageFromArgs(symbolsData);
}



/*
 * @param {NSDictionary} context
 */

function onRun(context) {
  const document   = context.document;
  const selection  = context.selection;
  const pluginName = 'Unsymbol Me';

  if (selection.count() > 0) {
    const resultMessage = unsymbolAll(selection);

    document.showMessage(`${pluginName}: ${resultMessage}`);
  } else {
    document.showMessage(`${pluginName}: select at least one symbol`);
  }
}

//onRun(context);
