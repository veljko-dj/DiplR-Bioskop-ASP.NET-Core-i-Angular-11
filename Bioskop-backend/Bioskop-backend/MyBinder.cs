using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend
{
    public class MyBinder<T> : IModelBinder

    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var name = bindingContext.ModelName;
            var value = bindingContext.ValueProvider.GetValue(name);

            if (value == ValueProviderResult.None)
                return Task.CompletedTask;

            try
            {
                var desValue = JsonConvert.DeserializeObject<T>(value.FirstValue);
                bindingContext.Result = ModelBindingResult.Success(desValue);
            }
            catch
            {
                bindingContext.ModelState.TryAddModelError(name, "NE VALJA");
            }


            return Task.CompletedTask;
        }
    }
}
