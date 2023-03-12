import { createEnvironmentInjector, EnvironmentInjector, inject, Injector } from '@angular/core';
import { _useOnDestroy } from './_on-destroy';

// TODO: use `runInInjectionContext` in v16 angular
export const useEnvironmentInjector = (): EnvironmentInjector => {
  const injector = createEnvironmentInjector([], inject(Injector) as EnvironmentInjector);
  const destroy = _useOnDestroy();

  destroy(() => {
    injector.destroy();
  });

  return injector;
};

export const useRunInInjectContext = (): (<ReturnT>(fn: () => ReturnT) => ReturnT) => {
  const injector = useEnvironmentInjector();

  return <ReturnT>(fn: () => ReturnT): ReturnT => {
    return injector.runInContext(fn);
  };
};
