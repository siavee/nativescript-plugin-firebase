import { HttpsCallable } from "./functions";
import * as firebase from '../firebase';
import { firebase as firebaseCommon } from "../firebase-common";

export function httpsCallable<I = {}, O = {}>(functionName: string, region: firebase.functions.SupportedRegions = "us-central1"): HttpsCallable<I, O> {
  const instance = com.google.firebase.functions.FirebaseFunctions.getInstance(region);

  return (data: I) => new Promise<O>((resolve, reject) => {

    const actData = firebaseCommon.toValue(data);

    return instance.getHttpsCallable(functionName)
        .call(actData)
        .continueWith(new (<any>com.google.android.gms).tasks.Continuation({
          then: (task) => {

            try {
              const result = task.getResult() as com.google.firebase.functions.HttpsCallableResult;
              const resultData = result.getData();

              resolve(firebaseCommon.toJsObject(resultData) as O);
            } catch (e) {
              console.log('Error Caught:', e);
              reject(e.message);
            }

          }
        }));
  });
}