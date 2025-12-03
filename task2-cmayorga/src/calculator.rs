///-------------------------------------------------------------------------------
/// Calculator implementation using enums, structs, and methods.
/// Supports addition, subtraction, and multiplication with overflow protection.
/// Keeps a history of successful operations.
///-------------------------------------------------------------------------------


#[derive(Clone)]
pub enum OperationType {
    Addition,
    Subtraction,
    Multiplication,
}

impl OperationType {
    
    pub fn get_sign(&self) -> &str {
        match self {
            OperationType::Addition => "+",
            OperationType::Subtraction => "-",
            OperationType::Multiplication => "*",
        }
    }

    
    pub fn perform(&self, x: i64, y: i64) -> Option<i64> {
        match self {
            OperationType::Addition => x.checked_add(y),
            OperationType::Subtraction => x.checked_sub(y),
            OperationType::Multiplication => x.checked_mul(y),
        }
    }
}


#[derive(Clone)]
pub struct Operation {
    pub first_num: i64,
    pub second_num: i64,
    pub operation_type: OperationType,
}

impl Operation {
    
    pub fn new(first_num: i64, second_num: i64, operation_type: OperationType) -> Self {
        Self { first_num, second_num, operation_type }
    }
}


pub struct Calculator {
    pub history: Vec<Operation>,
}

impl Calculator {
    
    pub fn new() -> Self {
        Self { history: Vec::new() }
    }

    
    pub fn addition(&mut self, x: i64, y: i64) -> Option<i64> {
        let op_type = OperationType::Addition;
        let result = op_type.perform(x, y)?;
        self.history.push(Operation::new(x, y, op_type));
        Some(result)
    }

    
    pub fn subtraction(&mut self, x: i64, y: i64) -> Option<i64> {
        let op_type = OperationType::Subtraction;
        let result = op_type.perform(x, y)?;
        self.history.push(Operation::new(x, y, op_type));
        Some(result)
    }

    
    pub fn multiplication(&mut self, x: i64, y: i64) -> Option<i64> {
        let op_type = OperationType::Multiplication;
        let result = op_type.perform(x, y)?;
        self.history.push(Operation::new(x, y, op_type));
        Some(result)
    }

    
    pub fn show_history(&self) -> String {
        let mut out = String::new();
        for (idx, op) in self.history.iter().enumerate() {
            if let Some(result) = op.operation_type.perform(op.first_num, op.second_num) {
                let line = format!(
                    "{}: {} {} {} = {}\n",
                    idx,
                    op.first_num,
                    op.operation_type.get_sign(),
                    op.second_num,
                    result
                );
                out.push_str(&line);
            }
        }
        out
    }

    
    pub fn repeat(&mut self, operation_index: usize) -> Option<i64> {
        let op = self.history.get(operation_index)?.clone();
        let result = op.operation_type.perform(op.first_num, op.second_num)?;
        self.history.push(op);
        Some(result)
    }

    
    pub fn clear_history(&mut self) {
        self.history.clear();
    }
}
