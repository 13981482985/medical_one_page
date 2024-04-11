import request from "@/utils/request";

export function getRequest(url, paramObj) {
  return request({
    method: "get",
    url,
    params: paramObj
  });
}

export function postRequest(url, data) {
  return request({
    method: "post",
    url,
    data
  })
}

export function getIndicators(url, types,tableName) {
  return request({
    method: "get",
    url,
    params: {
      types: types,
      tableName: tableName
    }
  });
}



export function getIndicatorInfo(url, checkedFeats,tableName) {
  return request({
    method: "get",
    url,
    params: {
      checkedFeats: checkedFeats,
      tableName: tableName
    }
  });
}

export function requestFormData(url, featureName,tableName) {
  return request({
    method: "get",
    url,
    params: {
      featureName: featureName,
      tableName: tableName
    }
  });
}

export function saveParentDisease(url, diseaseName) {
  return request({
    method: "get",
    url,
    params: {
      diseaseName: diseaseName
    }
  });
}

export function getSingleAnalyze(url, tableName, colNames) {
  return request({
    method: "get",
    url,
    params: {
      tableName: tableName,
      colNames: colNames
    }
  });
}


export function singleFactorAnalyze(url, tableName, featureName) {
  return request({
    method: "get",
    url,
    params: {
      tableName: tableName,
      featureName: featureName
    }
  });
}


export function exportTableByFields(url, tableName, featureList) {
  return request({
    method: "get",
    url,
    params: {
      tableName: tableName,
      featureList: featureList
    }
  });
}
export function addVisliazationTask(url, tableName, selectDisease) {
  return request({
    method: "get",
    url,
    params: {
      tableName: tableName,
      selectDisease: JSON.stringify(selectDisease)
    }
  });
}

export function exportDimensionalityReduction(url, newFeatureNames, oldFeatureNames, data) {
  return request({
    method: "get",
    url,
    params: {
      newFeatureNames: newFeatureNames,
      oldFeatureNames: oldFeatureNames,
      data: JSON.stringify(data)
    }
  });
}