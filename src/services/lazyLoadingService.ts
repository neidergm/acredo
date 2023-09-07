import { ComponentType } from "react";

/**
 * Function to try load 'split' react components
 * @param {function} lazyComponent function that load a lazy component 
 * @param {number} attemptsLeft default 2. Attemps number to try load component
 */

type T_LazyComponent = Promise<{ default: ComponentType<any> }>

const lazyLoaderComponents = (lazyComponent: () => T_LazyComponent, attemptsLeft = 3) => {
    return ():T_LazyComponent =>
        new Promise((resolve, reject) => {
            lazyComponent()
                .then(resolve)
                .catch((error: any) => {
                    //When a chunck failed, then try load again after 1.5s
                    setTimeout(() => {
                        if (attemptsLeft === 1 || !window.navigator?.onLine === false) {
                            reject(error);
                            return;
                        }
                        lazyLoaderComponents(lazyComponent, attemptsLeft - 1)().then(resolve, reject);
                    }, 1500)
                })
        })
}

export default lazyLoaderComponents;