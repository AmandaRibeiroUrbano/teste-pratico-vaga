import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'MontSerrat', sans-serif",
  },
  palette: {
    primary: {
      main: "#6D9886",
    },
    secondary: {
      main: "#393E46",
    },
    error: {
      main: "#E94560",
    },
  },
});

interface Product {
  name: string;
  description: string;
  value: number;
  available: "sim" | "nao";
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [showProducts, setShowProducts] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<Product>();

  const onSubmit = (data: Product) => {
    setProducts((prev) =>
      [...prev, { ...data, value: parseFloat(data.value.toString()) }].sort(
        (a, b) => a.value - b.value
      )
    );
    reset();
    setShowProducts(true);
    setMessage("Produto adicionado com sucesso!");
    setOpenSnackbar(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" style={{ padding: 24, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Cadastro de Produtos
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Insira as informações do produto abaixo.
        </Typography>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity={"success"} sx={{ mb: 2 }}>
            {message}
          </Alert>
        </Snackbar>

        <Card sx={{ mx: "auto", p: 3, maxWidth: 600 }}>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <TextField
                label="Nome do Produto"
                {...register("name", { required: "Campo obrigatório" })}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
              />

              <TextField
                label="Descrição"
                {...register("description", { required: "Campo obrigatório" })}
                error={!!errors.description}
                helperText={errors.description?.message}
                fullWidth
              />

              <TextField
                label="Valor (R$)"
                {...register("value", {
                  required: "Campo obrigatório",
                  pattern: {
                    value: /^[0-9]+([.,][0-9]{1,2})?$/,
                    message: "Digite um valor válido",
                  },
                })}
                error={!!errors.value}
                helperText={errors.value?.message}
                fullWidth
                onChange={(e) => {
                  e.target.value = e.target.value.replace(",", "."); 
                }}
              />

              <FormControl component="fieldset" error={!!errors.available}>
                <FormLabel component="legend">Disponível para Venda</FormLabel>
                <Controller
                  name="available"
                  control={control}
                  defaultValue="sim"
                  rules={{ required: "Escolha uma opção" }}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel
                        value="sim"
                        control={<Radio />}
                        label="Sim"
                      />
                      <FormControlLabel
                        value="nao"
                        control={<Radio />}
                        label="Não"
                      />
                    </RadioGroup>
                  )}
                />
                <FormHelperText>{errors.available?.message}</FormHelperText>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Cadastrar
              </Button>
            </form>
          </CardContent>
        </Card>

        <Button
          onClick={() => setShowProducts(!showProducts)}
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 3 }}
        >
          {showProducts ? "Esconder Produtos" : "Ver Produtos"}
        </Button>

        {showProducts && (
          <Card sx={{ mt: 3, p: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Lista de Produtos
              </Typography>
              {products.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Nome</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Valor</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          {product.value.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Ainda não há produtos cadastrados.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
        {showProducts && (
          <Button
            onClick={() => setShowProducts(false)}
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
          >
            Cadastrar Novo Produto
          </Button>
        )}
      </Container>
    </ThemeProvider>
  );
}
