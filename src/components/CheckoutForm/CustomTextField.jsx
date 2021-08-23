import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, Grid } from "@material-ui/core";

function FormInput({ name, label, required }) {
  const { control } = useFormContext();
 //esto lo hago porque me daba error y no podia ver e el navegador lo que esta abajo el render = field
  return (
    <Grid item xs={12} sm={6}>
      <Controller
            control={control}
            defaultValue=""
            name={name}
            render = {({ field})=> ( 
                <TextField
                    fullWidth
                    label={label}
                    required
                />
            )}
         />
    </Grid>
  );
}

export default FormInput;
